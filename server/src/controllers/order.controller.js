'use strict';

const OrderService = require('../services/order.service');

class OrderController {
    static async createOrder(req, res) {
        const { order, message } = await OrderService.createOrder({ userId: req.user._id, ...req.body });
        res.status(201).json({
            success: true,
            data: order,
            message, // Thông báo được trả về từ service
        });
    }

    static async cancelOrder(req, res) {
        const { address } = req.body;
        const result = await OrderService.cancelOrder({
            userId: req.user._id,
            orderId: req.params.id,
            address,
        });
        let message = 'Đơn hàng đã được hủy';
        if (['COIN', 'VNPAY'].includes(result.paymentMethod)) {
            message += `, số dư của bạn được +${result.refundedAmount.toLocaleString()}đ`;
        }
        res.status(201).json({
            success: true,
            data: result,
            message,
        });
    }

    static async reorder(req, res) {
        const result = await OrderService.reorder({
            userId: req.user._id,
            orderId: req.params.id,
        });

        let message = 'Đơn hàng đã được đặt lại thành công';
        if (result.paymentMethod === 'COIN') {
            message += `, số dư của bạn đã bị trừ -${result.totalOrderPrice.toLocaleString()}đ`;
        }

        res.status(201).json({
            success: true,
            data: result,
            message,
        });
    }

    static async createOfflineOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.createOfflineOrder({ adminId: req.admin._id, ...req.body }),
            message: 'Tạo đơn hàng thành công',
        });
    }
    static async getAllOrdersOffline(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrdersOffline({ ...req.query }),
        });
    }
    static async getAllOrdersByUser(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrdersByUser({ userId: req.user._id, ...req.query }),
        });
    }
    static async getAllOrders(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrders(req.query),
        });
    }
    static async updateOrderStatus(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.updateOrderStatus(req.body),
            message: 'Cập nhật trạng thái đơn hàng thành công',
        });
    }
    static async getOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getOrder(req.params.oid),
            message: 'Thành công',
        });
    }

    // Tìm kiếm đơn hàng theo mã order_code
    static async getOrderByCode(req, res) {
        try {
            const { code } = req.params;
            const order = await OrderService.getOrderByCode(code);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }
            return res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getOfflineOrderByCode(req, res) {
        try {
            const { code } = req.params;
            const order = await OrderService.getOfflineOrderByCode(code);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn hàng offline',
                });
            }

            return res.status(200).json({
                success: true,
                data: order,
                message: 'Tìm đơn hàng offline thành công',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = OrderController;
