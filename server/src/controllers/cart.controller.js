"use strict";

const CartService = require("../services/cart.service");

class CartController {
    static async addToCart(req, res, next) {
        const cart = await CartService.addToCart(req.userId, req.body);
        res.status(201).json({ success: true, data: cart });
    }

    static async getCartByUserId(req, res, next) {
        const cart = await CartService.getCartByUserId(req.userId);
        res.status(200).json({ success: true, data: cart });
    }

    static async updateCart(req, res, next) {
        const { productId, quantity } = req.body;
        const cart = await CartService.updateCart(req.userId, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    }

    static async removeFromCart(req, res, next) {
        const cart = await CartService.removeFromCart(req.userId, req.body.productId);
        res.status(200).json({ success: true, data: cart });
    }

    static async clearCart(req, res, next) {
        const cart = await CartService.clearCart(req.userId);
        res.status(200).json({ success: true, message: "Giỏ hàng đã được xóa", data: cart });
    }
}

module.exports = CartController;
