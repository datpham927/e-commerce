"use strict";

const Notification = require("../models/notification.model");
const { NotFoundError } = require("../core/error.response");

class NotificationService {
  // Gửi thông báo đến tất cả người dùng
  static async sendNotificationToAll(payload) {
    return await Notification.create({
      ...payload,
      notification_user: "all",
    });
  }

  // Gửi thông báo đến một người dùng cụ thể sau này để code vào chức năng thông báo giỏ hàng
  static async sendNotificationToUser(userId, payload) {
    return await Notification.create({
      ...payload,
      notification_user: userId,
    });
  }

  // Lấy thông báo của một người dùng
  static async getUserNotifications(userId) {
    return await Notification.find({
      $or: [{ notification_user: "all" }, { notification_user: userId }],
    }).sort({ createdAt: -1 });
  }

  // Đánh dấu thông báo là đã đọc
  static async markAsRead(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { notification_isWatched: true },
      { new: true }
    );
    if (!notification) throw new NotFoundError("Thông báo không tồn tại!");
    return notification;
  }
}

module.exports = NotificationService;
