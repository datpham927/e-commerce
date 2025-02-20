const express = require("express");
const CartController = require("../../controllers/cart.controller");
const asyncHandle = require("../../helper/asyncHandle");
const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post("/add", asyncHandle(CartController.addToCart));

// Lấy giỏ hàng của người dùng
router.get("/:userId", asyncHandle(CartController.getCartByUserId));

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/:userId", asyncHandle(CartController.updateCart));

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:userId/:productId", asyncHandle(CartController.removeFromCart));

// Xóa toàn bộ giỏ hàng của người dùng
router.delete("/:userId", asyncHandle(CartController.clearCart));

module.exports = router;
