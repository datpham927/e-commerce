"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

class UserService {
    static async addUser(payload) {
        const { user_name, user_email, user_password, user_mobile, user_type } = payload;

        if (!user_name || !user_email || !user_password || !user_mobile || !user_type) {
            throw new BadRequestError("Thiếu thông tin bắt buộc!", 400);
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await userModel.findOne({ user_email });
        if (existingUser) {
            throw new BadRequestError("Email đã tồn tại!", 400);
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingMobile = await userModel.findOne({ user_mobile });
        if (existingMobile) {
            throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Tạo user mới
        const newUser = new userModel({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_mobile,
            user_type
        });

        return await newUser.save();
    }

    static async updateUser(uid, payload) {
        const { user_email, user_password, user_mobile, ...dataUser } = payload;

        const user = await userModel.findById(uid);
        if (!user) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }

        if (user_mobile && user_mobile !== user.user_mobile) {
            const existingMobile = await userModel.findOne({ user_mobile });
            if (existingMobile) {
                throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
            }
            dataUser.user_mobile = user_mobile;
        }

        if (user_password) {
            const salt = await bcrypt.genSalt(10);
            dataUser.user_password = await bcrypt.hash(user_password, salt);
        }

        const updatedUser = await userModel.findByIdAndUpdate(uid, dataUser, {
            new: true,
            runValidators: true
        });

        return updatedUser;
    }

    static async deleteUser(uid) {
        const user = await userModel.findByIdAndDelete(uid);
        if (!user) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }
        return {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email
        };
    }

    static async toggleBlockUser(uid, isBlocked) {
        const user = await userModel.findById(uid);
        if (!user) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }

        if (user.user_isBlocked === isBlocked) {
            throw new BadRequestError(
                isBlocked ? "Người dùng đã bị chặn trước đó!" : "Người dùng chưa bị chặn!"
            );
        }

        user.user_isBlocked = isBlocked;
        await user.save();
        return isBlocked ? "Đã chặn người dùng thành công!" : "Đã mở chặn người dùng!";
    }
}

module.exports = UserService;
