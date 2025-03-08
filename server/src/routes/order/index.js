const express = require("express");
const OrderControllers = require("../../controllers/order.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

router.use(authentication)
// Thêm sản phẩm
router.post("/add", asyncHandle(OrderControllers.createOrder));
module.exports = router;
