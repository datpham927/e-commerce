"use strict";

const CartService = require("../services/cart.service");
const { BadRequestError } = require("../core/error.response");

class CartController {
  static async addToCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity) throw new BadRequestError("Thiếu thông tin sản phẩm.");

      const cart = await CartService.addToCart(req.userId, productId, quantity);
      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async getCartByUserId(req, res, next) {
    try {
      const cart = await CartService.getCartByUserId(req.userId);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      if (!productId || quantity <= 0) throw new BadRequestError("Thông tin không hợp lệ.");

      const cart = await CartService.updateCart(req.userId, productId, quantity);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      const { productId } = req.body;
      if (!productId) throw new BadRequestError("Thiếu thông tin sản phẩm.");

      const cart = await CartService.removeFromCart(req.userId, productId);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const response = await CartService.clearCart(req.userId);
      res.status(200).json({ success: true, message: response.message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
