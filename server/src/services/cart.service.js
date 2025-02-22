"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Cart = require("../models/cart.model");

class CartService {
    // Thêm sản phẩm vào giỏ hàng
    static async addToCart(userId, product) {
        if (!userId || !product) {
            throw new BadRequestError("Thiếu thông tin người dùng hoặc sản phẩm.");
        }
        let cart = await Cart.findOne({ cart_user: userId });
        if (!cart) {
            cart = await Cart.create({ cart_user: userId, cart_products: [product], cart_count_product: 1 });
        } else {
            const productIndex = cart.cart_products.findIndex(item => item.productId === product.productId);
            if (productIndex > -1) {
                cart.cart_products[productIndex].quantity += product.quantity;
            } else {
                cart.cart_products.push(product);
            }
            cart.cart_count_product = cart.cart_products.length;
            await cart.save();
        }
        return cart;
    }

    // Lấy giỏ hàng của người dùng
    static async getCartByUserId(userId) {
        const cart = await Cart.findOne({ cart_user: userId });
        if (!cart) throw new NotFoundError("Không tìm thấy giỏ hàng.");
        return cart;
    }

    // Cập nhật sản phẩm trong giỏ hàng
    static async updateCart(userId, productId, quantity) {
        const cart = await Cart.findOne({ cart_user: userId });
        if (!cart) throw new NotFoundError("Không tìm thấy giỏ hàng.");
        const productIndex = cart.cart_products.findIndex(item => item.productId === productId);
        if (productIndex === -1) throw new NotFoundError("Sản phẩm không tồn tại trong giỏ hàng.");
        cart.cart_products[productIndex].quantity = quantity;
        cart.cart_count_product = cart.cart_products.length;
        await cart.save();
        return cart;
    }
    // Xóa sản phẩm khỏi giỏ hàng
    static async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ cart_user: userId });
        if (!cart) throw new NotFoundError("Không tìm thấy giỏ hàng.");
        cart.cart_products = cart.cart_products.filter(item => item.productId !== productId);
        cart.cart_count_product = cart.cart_products.length;
        await cart.save();
        return cart;
    }

    // Xóa toàn bộ giỏ hàng
    static async clearCart(userId) {
        const cart = await Cart.findOneAndDelete({ cart_user: userId });
        if (!cart) throw new NotFoundError("Không tìm thấy giỏ hàng.");
        return cart;
    }
}

module.exports = CartService;
