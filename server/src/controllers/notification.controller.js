"use strict";

const NotificationService = require("../services/notification.service");
const asyncHandle = require("../helper/asyncHandle");

class NotificationController {
  // Lấy danh sách thông báo của người dùng
  static getUserNotifications = asyncHandle(async (req, res) => {
    const userId = req.user._id; // Lấy userId từ authentication middleware
    const notifications = await NotificationService.getUserNotifications(userId);
    return res.status(200).json({ success: true, notifications });
  });
  // Đánh dấu thông báo là đã đọc
  static markAsRead = asyncHandle(async (req, res) => {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(id);
    return res.status(200).json({ success: true, notification });
  });
}

module.exports = NotificationController;
