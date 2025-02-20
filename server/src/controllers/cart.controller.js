"use strict";

const CartService = require("../services/cart.service");

class CartController {
    static async addToCart(req, res, next) {
        const { userId, product } = req.body;
        const cart = await CartService.addToCart(userId, product);
        res.status(201).json({ success: true, data: cart });
    }

    static async getCartByUserId(req, res, next) {
        const cart = await CartService.getCartByUserId(req.params.userId);
        res.status(200).json({ success: true, data: cart });
    }

    static async updateCart(req, res, next) {
        const { productId, quantity } = req.body;
        const cart = await CartService.updateCart(req.params.userId, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    }

    static async removeFromCart(req, res, next) {
        const cart = await CartService.removeFromCart(req.params.userId, req.params.productId);
        res.status(200).json({ success: true, data: cart });
    }

    static async clearCart(req, res, next) {
        const cart = await CartService.clearCart(req.params.userId);
        res.status(200).json({ success: true, message: "Giỏ hàng đã được xóa", data: cart });
    }
}

module.exports = CartController;
