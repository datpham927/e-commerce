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
        const access_token = await UserAuthService.userSignup(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async userLogin(req, res) {
        const access_token = await UserAuthService.userLogin(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async userLogout(req, res) {
        await UserAuthService.userLogout(res);
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công!"
        });
    }
    static async refreshToken(req, res) {
        const { refresh_token } = req.cookies
        const access_token = await UserAuthService.handleRefreshToken(refresh_token, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Thành công!"
        });
    }
    
    // Gửi mã xác nhận quên mật khẩu
    static async forgotPassword(req, res) {
        const response = await UserAuthService.forgotPassword(req.body);
        res.json(response);
    }

    // Xác nhận mã quên mật khẩu
    static async verifyResetCode(req, res) {
        const response = await UserAuthService.verifyResetCode(req.body);
        res.json(response);
    }

    // Đổi mật khẩu mới
    static async resetPassword(req, res) {
        const response = await UserAuthService.resetPassword(req.body);
        res.json(response);
    }
}

module.exports = UserAuthController;
