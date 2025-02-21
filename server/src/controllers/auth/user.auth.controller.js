"use strict";

const UserAuthService = require("../../services/user.auth.service");

class UserAuthController {
    // Gửi token xác nhận email
    static async sendVerificationEmail(req, res) {
        await UserAuthService.sendVerificationEmail(req.body);
        return res.status(200).json({
            success: true,
            message: "Mã xác thực đã được gửi thành công!"
        });

    }
    // Xác nhận email bằng token
    static async confirmVerificationEmail(req, res) {
        await UserAuthService.confirmVerificationEmail(req.body);
        return res.status(200).json({
            success: true,
            message: "Email xác thực thành công!"
        });
    }
    // thực hiện đăng ký khi xác thực thành công
    static async userSignup(req, res) {
        const data = await UserAuthService.userSignup(req.body);
        const { accessToken, refreshToken } = data
        res.cookie("refresh_token", `Bearer ${refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            data: { access_token: accessToken },
            message: "Đăng ký thành công!"
        });
    }
    static async userLogin(req, res) {
        const data = await UserAuthService.userLogin(req.body);
        const { accessToken, refreshToken } = data
        res.cookie("refresh_token", `Bearer ${refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            data: { access_token: accessToken },
            message: "Đăng nhập thành công!"
        });
    }
}

module.exports = UserAuthController;
