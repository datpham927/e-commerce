"use strict";

const AdminAuthService = require("../../services/user.auth.service");

class AdminAuthController {
    static async userLogin(req, res) {
        const access_token = await AdminAuthService.userLogin(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async userLogout(req, res) {
        await AdminAuthService.userLogout(res);
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công!"
        });
    }
    static async refreshToken(req, res) {
        const { refresh_token } = req.cookies
        const access_token = await AdminAuthService.handleRefreshToken(refresh_token, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Thành công!"
        });
    }
}

module.exports = AdminAuthController;
