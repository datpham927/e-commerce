const express = require("express");
const OrderControllers = require("../../controllers/order.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

router.use(authentication)
// Thêm sản phẩm
router.post("/add", asyncHandle(OrderControllers.createOrder))
router.get("/by-user", asyncHandle(OrderControllers.getAllOrdersByUser));
router.use(restrictTo(PERMISSIONS.ORDER_MANAGE));
router.put('/update-status', asyncHandle(OrderControllers.updateOrderStatus));
;
module.exports = router;
