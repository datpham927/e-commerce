"use strict";

const OrderService = require("../services/order.service");

class OrderController {
    static async createOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.createOrder({ userId: req.user._id, ...req.body }),
            message: 'Đặt hàng thành công'
        });
    }
    static async getAllOrdersByUser(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrdersByUser({ userId: req.user._id, ...req.query })
        });
    }
    static async updateOrderStatus(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.updateOrderStatus(req.body),
            message: "Cập nhật trạng thái đơn hàng thành công"
        });
    }
}

module.exports = OrderController;