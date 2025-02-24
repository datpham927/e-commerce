const express = require("express");
const CartController = require("../../controllers/cart.controller");
const asyncHandle = require("../../helper/asyncHandle");
const authentication = require("../../middlewares/authentication");
const router = express.Router();


router.use(authentication)
router.post("/add", asyncHandle(CartController.addToCart));
router.put("/update", asyncHandle(CartController.updateCart));// Cập nhật số lượng sản phẩm trong giỏ hàng
router.delete("/", asyncHandle(CartController.removeFromCart));// Xóa sản phẩm khỏi giỏ hàng
router.delete("/clear", asyncHandle(CartController.clearCart));// Xóa toàn bộ giỏ hàng của người dùng
router.get("/get", asyncHandle(CartController.getCartByUserId));// Lấy giỏ hàng của người dùng
module.exports = router;
