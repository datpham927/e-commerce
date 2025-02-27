"use strict";

const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification.controller");
const { authentication } = require("../../middlewares/authMiddleware");


// Middleware kiểm tra đăng nhập cho tất cả route
router.use(authentication);
// Lấy danh sách thông báo của người dùng (yêu cầu đăng nhập)
router.get("/", NotificationController.getUserNotifications);
// Đánh dấu thông báo là đã đọc
router.put("/:id/read", NotificationController.markAsRead);

module.exports = router;
