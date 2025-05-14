'use strict';
const mongoose = require('mongoose');

const { RequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const OrderModel = require('../models/OnlineOrder.model');
const ReviewModel = require('../models/reviews.model');
const Voucher = require('../models/voucher.model');
const UserVoucherModel = require('../models/userVoucher.model');
const voucherModel = require('../models/voucher.model');
const userVoucherModel = require('../models/userVoucher.model');

class UserService {
    static async addUser(payload) {
        const { user_name, user_email, user_password, user_mobile } = payload;
        if (!user_name || !user_email || !user_password || !user_mobile) {
            throw new RequestError('Thiếu thông tin bắt buộc!', 400);
        }
        const existingUser = await UserModel.findOne({ user_email });
        if (existingUser) throw new RequestError('Email đã tồn tại!', 400);
        const existingMobile = await UserModel.findOne({ user_mobile });
        if (existingMobile) throw new RequestError('Số điện thoại đã tồn tại!', 400);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);
        const newUser = new UserModel({
            ...payload,
            user_password: hashedPassword,
        });

        return await newUser.save();
    }

    static async deleteUser(uid) {
        // Kiểm tra uid có phải ObjectId hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            throw new RequestError('ID người dùng không hợp lệ.');
        }

        // Kiểm tra xem người dùng đã từng đánh giá chưa
        const hasReviews = await ReviewModel.exists({ user: new mongoose.Types.ObjectId(uid) });

        if (hasReviews) {
            throw new RequestError('Không thể xóa tài khoản vì người dùng đã từng đánh giá sản phẩm.');
        }

        // Tiến hành xóa
        const deletedUser = await UserModel.findByIdAndDelete(uid);
        if (!deletedUser) {
            throw new RequestError('Người dùng không tồn tại.');
        }

        return {
            message: 'Xóa người dùng thành công.',
        };
    }
    static async toggleBlockUser(uid, isBlocked) {
        const user = await UserModel.findById(uid);
        if (!user) throw new RequestError('Người dùng không tồn tại!', 404);
        user.user_isBlocked = isBlocked;
        await user.save();
        return isBlocked ? 'Đã chặn người dùng thành công!' : 'Đã mở chặn người dùng!';
    }

    static async getAllUsers({ limit, page }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const users = await UserModel.find()
            .sort({ createdAt: -1 })
            .select('user_name user_email user_isBlocked user_address user_mobile user_avatar_url')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalUser = await UserModel.countDocuments();
        return {
            totalPage: Math.ceil(totalUser / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalUser,
            users,
        };
    }

    static async getProfile(userid) {
        return await UserModel.findById(userid).select(
            '_id user_name user_reward_points user_email user_isBlocked user_address user_mobile user_avatar_url user_spin_turns user_balance',
        );
    }
    static async updateProfile(uid, payload) {
        const { _id, ...updateData } = payload; // Loại bỏ _id khỏi dữ liệu cập nhật

        // Tìm user theo ID
        const user = await UserModel.findById(uid);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (updateData.user_mobile && updateData.user_mobile !== user.user_mobile) {
            const existingMobile = await UserModel.findOne({ user_mobile: updateData.user_mobile });
            if (existingMobile) {
                throw new RequestError('Số điện thoại đã tồn tại!', 409); // Mã lỗi 409 phù hợp hơn cho xung đột
            }
        }

        // Cập nhật thông tin
        const updatedUser = await UserModel.findByIdAndUpdate(uid, updateData, {
            new: true, // Trả về tài liệu đã cập nhật
            runValidators: true, // Chạy các validator của schema
        });

        return updatedUser;
    }
    static async searchUsers(query) {
        const { name } = query; // Lấy từ query parameter
        if (!name) {
            throw new RequestError('Vui lòng cung cấp từ khóa tìm kiếm!', 400);
        }

        const users = await UserModel.find({
            $or: [
                { user_name: { $regex: name, $options: 'i' } }, // Tìm theo tên người dùng
                { user_email: { $regex: name, $options: 'i' } }, // Tìm theo email
                { user_mobile: { $regex: name, $options: 'i' } },
            ],
        })
            .select('user_name user_email user_isBlocked user_mobile user_avatar_url')
            .lean();

        return users;
    }
    static async updateUserByAdmin(userId, updateData) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại');
        }

        // Kiểm tra trùng email với user khác
        if (updateData.user_email) {
            const existingEmailUser = await UserModel.findOne({
                user_email: updateData.user_email,
                _id: { $ne: userId }, // khác chính user đang update
            });
            if (existingEmailUser) {
                throw new RequestError('Email đã được sử dụng bởi người dùng khác');
            }
        }

        // Kiểm tra trùng số điện thoại với user khác
        if (updateData.user_mobile) {
            const existingMobileUser = await UserModel.findOne({
                user_mobile: updateData.user_mobile,
                _id: { $ne: userId },
            });
            if (existingMobileUser) {
                throw new RequestError('Số điện thoại đã được sử dụng bởi người dùng khác');
            }
        }

        // Nếu có mật khẩu mới thì hash lại
        if (updateData.user_password) {
            if (updateData.user_password.length < 6) {
                throw new RequestError('Mật khẩu phải có ít nhất 6 ký tự');
            }
            updateData.user_password = await bcrypt.hash(updateData.user_password, 10);
        }

        // Cập nhật thông tin còn lại
        for (let key in updateData) {
            user[key] = updateData[key];
        }

        await user.save();

        return {
            message: 'Cập nhật người dùng thành công',
            user: {
                _id: user._id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_mobile: user.user_mobile,
                user_role: user.user_role,
                user_isBlocked: user.user_isBlocked,
            },
        };
    }

    static async changePassword(uid, oldPassword, newPassword) {
        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            throw new RequestError('Mật khẩu mới phải có ít nhất 6 ký tự', 400);
        }

        // Tìm người dùng theo ID
        const user = await UserModel.findById(uid);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.user_password);
        if (!isMatch) {
            throw new RequestError('Mật khẩu cũ không đúng!', 400);
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới và thời gian thay đổi
        user.user_password = hashedPassword;
        user.user_passwordChangedAt = new Date();

        // Lưu thông tin cập nhật
        await user.save();

        return {
            success: true,
            message: 'Đổi mật khẩu thành công!',
        };
    }
    static async playLuckyBox(userId, prizeIndex) {
        const user = await UserModel.findById(userId);
        if (!user) {
            console.error(`User not found: ${userId}`);
            throw new RequestError('Người dùng không tồn tại!', 404);
        }
        if ((user.user_spin_turns || 0) <= 0) {
            console.error(`User ${userId} has no spin turns`);
            throw new RequestError('Bạn đã hết lượt quay!', 400);
        }

        console.log(`User ${userId} spun with prizeIndex: ${prizeIndex}`);
        const currentDate = new Date();
        let response = {
            type: 'none',
            message: 'Phần thưởng không hợp lệ.',
        };

        switch (prizeIndex) {
            case 0: // +10,000 điểm
                user.user_reward_points = (user.user_reward_points || 0) + 10000;
                response = {
                    type: 'point',
                    point: 10000,
                };
                break;
            case 2: {
                // Nhận voucher
                const vouchers = await voucherModel.find({
                    voucher_is_active: true,
                    voucher_start_date: { $lte: currentDate },
                    voucher_end_date: { $gte: currentDate },
                });
                if (!vouchers.length) {
                    response = {
                        type: 'none',
                        message: 'Hiện không có voucher nào khả dụng, thử lại sau!',
                    };
                    break;
                }
                const randomVoucher = vouchers[Math.floor(Math.random() * vouchers.length)];
                let userVouchers = await userVoucherModel.findOne({ vc_user_id: userId });
                if (!userVouchers) {
                    await userVoucherModel.create({
                        vc_user_id: userId,
                        vc_vouchers: [randomVoucher._id],
                    });
                } else {
                    const exists = userVouchers.vc_vouchers.some((vId) => vId.toString() === randomVoucher._id.toString());
                    if (!exists) {
                        userVouchers.vc_vouchers.push(randomVoucher._id);
                        await userVouchers.save();
                    }
                }
                response = {
                    type: 'voucher',
                    voucher: randomVoucher,
                    message: 'Bạn đã nhận được 1 voucher!',
                };
                break;
            }
            case 3: // +1 lượt quay
                user.user_spin_turns += 1;
                response = {
                    type: 'ticket',
                    ticket: 1,
                };
                break;
            case 5: // +50,000 điểm
                user.user_reward_points = (user.user_reward_points || 0) + 50000;
                response = {
                    type: 'point',
                    point: 50000,
                };
                break;
            case 7: // +2 lượt quay
                user.user_spin_turns += 2;
                response = {
                    type: 'ticket',
                    ticket: 2,
                };
                break;
            default:
                console.error(`Invalid prizeIndex: ${prizeIndex} for user ${userId}`);
                throw new RequestError('Giá trị prizeIndex không hợp lệ!', 400);
        }

        // Trừ lượt quay sau khi xác nhận phần thưởng
        user.user_spin_turns -= 1;
        await user.save();
        return response;
    }

    // Lấy 3 voucher mới nhất
    static async getLatestVouchers() {
        return Voucher.find({
            voucher_type: 'user',
            voucher_is_active: true,
            voucher_end_date: { $gte: new Date() },
        })
            .sort({ createdAt: -1 })
            .limit(3);
    }
}

module.exports = UserService;
