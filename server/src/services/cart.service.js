"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

class CartService {
  // Thêm sản phẩm vào giỏ hàng
  static async addToCart(userId, productId, quantity) {
    if (!userId || !productId || quantity <= 0) {
      throw new BadRequestError("Thông tin không hợp lệ.");
    }

    quantity = Number(quantity); // Ép kiểu để tránh lỗi chuỗi "22"

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Sản phẩm không tồn tại.");

    let cart = await Cart.findOne({ cart_user: userId });

    if (!cart) {
      cart = await Cart.create({
        cart_user: userId,
        cart_products: [{ productId, quantity }],
      });
    } else {
      const productIndex = cart.cart_products.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (productIndex > -1) {
        cart.cart_products[productIndex].quantity += quantity; // Cộng số lượng đúng
      } else {
        cart.cart_products.push({ productId, quantity });
      }

      await cart.save();
    }

    return this.getCartByUserId(userId);
  }

  // Lấy giỏ hàng của người dùng
  static async getCartByUserId(userId) {
    const cart = await Cart.findOne({ cart_user: userId })
      .populate({
        path: "cart_products.productId",
        select: "product_name product_thumb product_price product_images",
      })
      .lean();

    if (!cart) throw new NotFoundError("Giỏ hàng trống.");

    return {
      cart_user: cart.cart_user,
      cart_products: cart.cart_products.map((item) => ({
        productId: item.productId._id,
        product_name: item.productId.product_name,
        product_thumb: item.productId.product_thumb,
        product_images: item.productId.product_images,
        product_price: item.productId.product_price,
        quantity: item.quantity,
      })),
    };
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCart(userId, productId, quantity) {
    quantity = Number(quantity);
    if (quantity <= 0) throw new BadRequestError("Số lượng không hợp lệ.");

    const cart = await Cart.findOne({ cart_user: userId });
    if (!cart) throw new NotFoundError("Giỏ hàng không tồn tại.");

    const productIndex = cart.cart_products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) throw new NotFoundError("Sản phẩm không có trong giỏ hàng.");

    cart.cart_products[productIndex].quantity = quantity;
    await cart.save();

    return this.getCartByUserId(userId);
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ cart_user: userId });
    if (!cart) throw new NotFoundError("Giỏ hàng không tồn tại.");

    cart.cart_products = cart.cart_products.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return this.getCartByUserId(userId);
  }

  // Xóa toàn bộ giỏ hàng
  static async clearCart(userId) {
    await Cart.findOneAndDelete({ cart_user: userId });
    return { message: "Giỏ hàng đã được xóa thành công." };
  }
}

module.exports = CartService;
