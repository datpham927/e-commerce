const express = require("express");
const CartController = require("../../controllers/cart.controller");
const asyncHandle = require("../../helper/asyncHandle");
const authentication = require("../../middlewares/authentication");

const router = express.Router();

// Sử dụng middleware authentication cho tất cả các route trong cart
router.use(authentication);

// Route thêm sản phẩm vào giỏ hàng
router.post("/add", asyncHandle(CartController.addToCart));

// Route cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", asyncHandle(CartController.updateCart));

// Route xóa sản phẩm khỏi giỏ hàng
router.delete("/", asyncHandle(CartController.removeFromCart));

// Route xóa toàn bộ giỏ hàng của người dùng
router.delete("/clear", asyncHandle(CartController.clearCart));

// Route lấy giỏ hàng của người dùng
router.get("/get", asyncHandle(CartController.getCartByUserId));



module.exports = router;
