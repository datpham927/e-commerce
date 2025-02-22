"use strict";

const UserAuthService = require("../../services/user.auth.service");

class UserAuthController {
    // Gửi token xác nhận email
    static async sendVerificationEmail(req, res) {
        await UserAuthService.sendVerificationEmail(req.body.email);
        return res.status(200).json({
            success: true,
            message: "Email xác thực đã được gửi thành công!"
        });

    }
    // Xác nhận email bằng token
    static async confirmVerificationEmail(req, res) {
        const { token, email } = req.body
        await UserAuthService.confirmVerificationEmail(token, email);
        return res.status(200).json({
            success: true,
            message: "Email xác thực thành công!"
        });
    }
    // thực hiện đăng ký khi xác thực thành công
    static async userSignup(req, res) {
        const { email, password, name } = req.body
        await UserAuthService.userSignup(email, password, name);
        return res.status(200).json({
            success: true,
            message: "Đăng ký thành công!"
        });
    }
}

module.exports = UserAuthController;
