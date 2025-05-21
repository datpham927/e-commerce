'use strict';
const Voucher = require('../models/voucher.model');
const { RequestError } = require('../core/error.response');
const voucherModel = require('../models/voucher.model');
const autoCode = require('../utils/autoCode');

class VoucherService {
    // Tạo voucher mới
    static async createVoucher(payload) {
        // Kiểm tra các trường bắt buộc
        if (Object.keys(payload).length === 0) {
            throw new RequestError('Vui lòng cung cấp dữ liệu!');
        }

        // Kiểm tra tên voucher có bị trùng không
        const existingVoucher = await voucherModel.findOne({
            voucher_name: payload.voucher_name,
        });
        if (existingVoucher) {
            throw new RequestError('Tên voucher code đã tồn tại!');
        }

        // Kiểm tra định dạng ngày bắt đầu và ngày hết hạn
        const startDate = new Date(payload.voucher_start_date);
        const endDate = new Date(payload.voucher_end_date);
        if (startDate >= endDate) {
            throw new RequestError('Ngày hết hạn phải sau ngày bắt đầu!');
        }

        // Kiểm tra giá trị voucher hợp lệ (giá trị voucher và giá trị đơn hàng tối thiểu phải lớn hơn 0)
        if (payload.voucher_value <= 0) {
            throw new RequestError('Giá trị voucher phải lớn hơn 0!');
        }
        if (payload.voucher_min_order_value <= 0) {
            throw new RequestError('Giá trị đơn hàng tối thiểu phải lớn hơn 0!');
        }

        // Tạo voucher mới
        const voucher = await voucherModel.create({
            ...payload,
            voucher_code: autoCode(payload.voucher_name),
        });
        return voucher;
    }

    // Lấy danh sách tất cả voucher
    static async getAllVouchers({ limit, page }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const vouchers = await voucherModel
            .find({ voucher_is_active: true })
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .select(' -createdAt -updatedAt -__v')
            .limit(limitNum)
            .lean();
        const totalVoucher = await voucherModel.countDocuments();
        return {
            totalPage: Math.ceil(totalVoucher / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalVoucher,
            vouchers,
        };
    }
    static async getAllSystemVouchers({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10; // Mặc định limit = 10
        const pageNum = parseInt(page, 10) || 0; // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const now = new Date(); // Lấy thời gian hiện tại
        const vouchers = await voucherModel
            .find({
                voucher_type: 'system',
                voucher_is_active: true,
                voucher_start_date: { $lte: now }, // voucher đã bắt đầu
                voucher_end_date: { $gte: now }, // voucher chưa hết hạn
            })
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .select('-__v -createdAt -updatedAt')
            .limit(limitNum)
            .lean();

        const totalVoucher = await voucherModel.countDocuments({
            voucher_type: 'system',
            voucher_is_active: true,
            voucher_start_date: { $lte: now },
            voucher_end_date: { $gte: now },
        });

        return {
            totalPage: Math.ceil(totalVoucher / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum,
            totalVoucher,
            vouchers,
        };
    }

    static async getAllRedeemVouchers({ limit, page }) {
        const limitNum = parseInt(limit, 10); // Mgit ặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const currentDate = new Date();
        const vouchers = await voucherModel
            .find({
                voucher_type: 'user',
                voucher_is_active: true,
                voucher_start_date: { $lte: currentDate }, // voucher đã bắt đầu
                voucher_end_date: { $gte: currentDate },
            })
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .select('-__v -createdAt -updatedAt')
            .limit(limitNum)
            .lean();
        const totalVoucher = await voucherModel.countDocuments({
            voucher_type: 'user',
            voucher_start_date: { $lte: currentDate }, // voucher đã bắt đầu
            voucher_end_date: { $gte: currentDate },
        });
        return {
            totalPage: Math.ceil(totalVoucher / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalVoucher,
            vouchers,
        };
    }

    // Cập nhật voucher theo ID
    static async updateVoucher(id, payload) {
        // Kiểm tra id hợp lệ
        if (!id) {
            throw new RequestError('Thiếu id voucher cần cập nhật!');
        }

        // Kiểm tra payload hợp lệ
        if (!payload || !payload.voucher_name) {
            throw new RequestError('Thiếu dữ liệu cập nhật voucher!');
        }

        // Kiểm tra tên voucher có bị trùng với voucher khác (bỏ qua voucher hiện tại)
        const existingVoucher = await voucherModel.findOne({
            voucher_name: payload.voucher_name,
            _id: { $ne: id },
        });

        if (existingVoucher) {
            throw new RequestError('Tên voucher đã tồn tại!');
        }

        // Cập nhật voucher
        const updatedVoucher = await voucherModel.findByIdAndUpdate(
            id,
            {
                ...payload,
                voucher_code: autoCode(payload.voucher_name),
            },
            { new: true, runValidators: true }, // runValidators để đảm bảo các validate trong Schema được kiểm tra
        );

        if (!updatedVoucher) {
            throw new RequestError('Voucher không tồn tại!');
        }

        return updatedVoucher;
    }

    // Xóa voucher theo ID
    static async deleteVoucher(id) {
        const voucher = await voucherModel.findByIdAndDelete(id);
        if (!voucher) throw new RequestError('Voucher không tồn tại!');
        return voucher;
    }

    // 🔹 Tìm kiếm voucher theo tên
    static async searchVoucherByName(name) {
        if (!name) {
            throw new RequestError('Vui lòng nhập từ khóa tìm kiếm!');
        }

        // Escape ký tự đặc biệt để tránh lỗi regex
        const escapeRegex = (str) => {
            return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        };

        const escapedName = escapeRegex(name);
        const vouchers = await voucherModel.find({
            $or: [
                { voucher_name: { $regex: escapedName, $options: 'i' } },
                { voucher_code: { $regex: escapedName, $options: 'i' } },
            ],
        });

        if (!vouchers.length) {
            throw new RequestError('Không tìm thấy voucher phù hợp!');
        }

        return vouchers;
    }
    // Áp dụng voucher
    static async applyVoucher({ code, orderValue }) {
        const voucher = await Voucher.findOne({
            voucher_code: code,
            voucher_is_active: true,
            voucher_start_date: { $lte: new Date() },
            voucher_end_date: { $gte: new Date() },
            voucher_max_uses: { $gt: 0 },
        });

        if (!voucher) {
            throw new RequestError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        }

        if (orderValue < voucher.voucher_min_order_value) {
            throw new RequestError(`Đơn hàng cần tối thiểu ${voucher.voucher_min_order_value} VND để áp dụng mã`);
        }

        let discount = 0;
        if (voucher.voucher_method === 'percent') {
            discount = (orderValue * voucher.voucher_value) / 100;
            if (voucher.voucher_max_price) {
                discount = Math.min(discount, voucher.voucher_max_price);
            }
        } else if (voucher.voucher_method === 'fixed') {
            discount = voucher.voucher_value;
        }

        // Giảm số lần sử dụng voucher
        await Voucher.findByIdAndUpdate(voucher._id, { $inc: { voucher_max_uses: -1 } });

        return {
            discount,
            voucherId: voucher._id,
        };
    }
    // Lấy danh sách voucher đang active và trong thời gian hiển thị banner
    static async getActiveBannerVouchers() {
        const currentDate = new Date();
        const vouchers = await voucherModel
            .find({
                voucher_type: 'system',
                voucher_is_active: true,
                voucher_start_date: { $lte: currentDate },
                voucher_end_date: { $gte: currentDate },
            })
            .sort({ createdAt: -1 })
            .lean();

        return vouchers;
    }
    // Lấy voucher theo ID
    static async getVoucherByCode(code) {
        const voucher = await voucherModel.findOne({ voucher_is_active: true, voucher_code: code });
        if (!voucher) throw new RequestError('Voucher không tồn tại!');
        return voucher;
    }
}

module.exports = VoucherService;
