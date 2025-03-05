"use strict";

const UserService = require("../services/user.service");

class AuthController {
    // Gửi token xác nhận email
    static async addUser(req, res) {
        res.status(200).json({
            success: true,
            message: "Thêm thành công",
            data: await UserService.addUser(req.body)
        });
    }
    static async updateUser(req, res) {
        res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            data: await UserService.updateUser(req.params.uid, req.body)
        });
    }
    static async deleteUser(req, res) {
        res.status(200).json({
            success: true,
            message: "Xóa thành công",
            data: await UserService.deleteUser(req.params.uid, req.body)
        });
    }
    static async toggleBlockUser(req, res) {
        const { isBlocked } = req.body
        res.status(200).json({
            success: true,
            message: await UserService.toggleBlockUser(req.params.uid, isBlocked)
        });
    }

    //lấy all tk 
    static async getAllUsers(req, res) {
        res.status(200).json({
            success: true,
            message: "Lấy danh sách người dùng thành công",
            data: await UserService.getAllUsers()
        });
    }
    
}

module.exports = AuthController;
