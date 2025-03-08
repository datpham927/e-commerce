"use strict";

const OrderService = require("../services/order.service");

class OrderController {
    static async createOrder(req, res) {
        const newOrder = await OrderService.createOrder({ userId: req.user._id, ...req.body });
        res.status(201).json({ success: true, data: newOrder });
    }

}

module.exports = OrderController;