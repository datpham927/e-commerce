'use strict';
const { RequestError, NotFoundError, ConflictRequestError } = require('../core/error.response');
const userVoucherModel = require('../models/userVoucher.model');
const voucherModel = require('../models/voucher.model');
const userModel = require('../models/user.model');

class UserVoucherService {
    // Lưu voucher cho người dùng
    static async saveVoucherForUser(userId, voucherId) {
        if (!userId || !voucherId) throw new RequestError('Thiếu thông tin');

        // Kiểm tra voucher có tồn tại và còn hạn không
        const voucher = await voucherModel.findOne({
            _id: voucherId,
            voucher_is_active: true, // Kiểm tra trạng thái hoạt động của voucher
            voucher_end_date: { $gte: new Date() }, // Kiểm tra hạn sử dụng
        });
        // Thêm log để kiểm tra thông tin voucher
        if (!voucher) throw new NotFoundError('Voucher không tồn tại hoặc đã hết hạn');
        const userVoucherCount = voucher.voucher_users_used.some((userId) => userId.toString() === userId.toString());
        console.log(voucher.voucher_users_used);
        if (userVoucherCount) {
            throw new RequestError('Bạn đã đạt giới hạn số lần sử dụng voucher này');
        }
        // Tìm danh sách voucher của user
        const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId });
        if (!userVouchers) {
            // Nếu chưa có danh sách voucher thì tạo mới
            await userVoucherModel.create({ vc_user_id: userId, vc_vouchers: [voucherId] });
        } else {
            // Kiểm tra voucher đã được lưu chưa
            if (userVouchers.vc_vouchers.includes(voucherId)) {
                throw new RequestError('Voucher đã được lưu trước đó');
            }
            // Thêm voucher vào danh sách
            userVouchers.vc_vouchers.push(voucherId);
            await userVouchers.save();
        }
        return userVoucherModel.findOne({ vc_user_id: userId }).populate('vc_vouchers').lean();
    }

    // Đổi voucher
    static async redeemVoucher(userId, voucherId) {
        if (!userId || !voucherId) throw new RequestError('Vui lòng cung cấp thông tin');

        const user = await userModel.findById(userId);
        if (!user) throw new NotFoundError('Không tìm thấy người dùng');

        const voucher = await voucherModel.findById(voucherId);
        if (!voucher) throw new NotFoundError('Không tìm thấy voucher');

        // Kiểm tra voucher có đang hoạt động không
        if (!voucher.voucher_is_active) throw new RequestError('Voucher này hiện không hoạt động');

        const currentDate = new Date();

        // Kiểm tra xem voucher có hết hạn không
        if (currentDate < voucher.voucher_start_date || currentDate > voucher.voucher_end_date) {
            throw new RequestError('Voucher đã hết hạn sử dụng');
        }

        // Kiểm tra xem người dùng đã sở hữu voucher này chưa
        const existingVoucher = await userVoucherModel.findOne({
            vc_user_id: userId,
            vc_vouchers: voucherId,
        });
        if (existingVoucher) throw new RequestError('Bạn đã sở hữu voucher này');
        // Kiểm tra user đã sử dụng hay chưa
        const userVoucherCount = voucher.voucher_users_used.some((userId) => userId.toString() === userId.toString());
        if (userVoucherCount) {
            throw new RequestError('Bạn đã đạt giới hạn số lần sử dụng voucher này');
        }
        // Kiểm tra điểm của người dùng để đổi voucher
        if (user.user_reward_points < voucher.voucher_required_points) {
            throw new RequestError(`Không đủ điểm để đổi voucher. Cần ${voucher.voucher_required_points} điểm`);
        }

        // Trừ điểm của người dùng
        user.user_reward_points -= voucher.voucher_required_points;

        // Lưu voucher mới vào danh sách voucher của người dùng
        await userVoucherModel.findOneAndUpdate(
            { vc_user_id: userId },
            { $push: { vc_vouchers: voucherId }, $addToSet: { vc_users_used: userId } },
            { new: true, upsert: true },
        );
        await user.save();
        return userVoucherModel.findOne({ vc_user_id: userId }).populate('vc_vouchers').lean();
    }

    // Lấy danh sách voucher của user
    static async getVoucherByUser(userId) {
        if (!userId) throw new RequestError('Thiếu thông tin người dùng');

        const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId }).populate('vc_vouchers');

        if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
            throw new RequestError('Người dùng chưa có voucher nào');
        }

        return userVouchers.vc_vouchers;
    }

    // Lấy danh sách voucher còn hạn của user
    static async getVouchersByUser(userId) {
        if (!userId) throw new RequestError('Thiếu thông tin người dùng');

        const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId }).populate({
            path: 'vc_vouchers',
            match: { voucher_end_date: { $gte: new Date() } }, // Chỉ lấy voucher còn hạn
        });

        if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
            throw new RequestError('Người dùng chưa có voucher nào còn hạn');
        }

        return userVouchers.vc_vouchers;
    }

    // Tìm voucher theo tên cho user
    static async searchVoucherByNameForUser(userId, name) {
        if (!userId || !name) throw new RequestError('Thiếu thông tin tìm kiếm');

        const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId }).populate({
            path: 'vc_vouchers',
            match: { voucher_name: { $regex: new RegExp(name, 'i') } },
        });

        if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
            throw new NotFoundError('Không tìm thấy voucher nào phù hợp');
        }

        return userVouchers.vc_vouchers;
    }
}

module.exports = UserVoucherService;
