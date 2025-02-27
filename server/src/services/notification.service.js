"use strict";

const Notification = require("../models/notification.model");
const { NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");

class NotificationService {
  // Gửi thông báo đến tất cả người dùng
  static async sendNotificationToAll(payload) {
    if (Object.keys(payload).length === 0) {
      throw new BadRequestError("Vui lòng cung cấp thông tin thông báo");
    }
    // Lấy danh sách tất cả user (chỉ lấy `_id` để tối ưu)
    const users = await userModel.find({}, "_id").lean();
    if (users.length > 0) {
      // Tạo danh sách thông báo
      const notifications = users.map(user => ({
        notification_user: user._id,
        ...payload
      }));
      // Chèn hàng loạt để tăng hiệu suất
      await Notification.insertMany(notifications);
    }
  }

  // Gửi thông báo đến một người dùng cụ thể sau này để code vào chức năng thông báo giỏ hàng
  static async sendNotificationToUser(userId, payload) {
    return await Notification.create({
      notification_user: userId,
      ...payload,
    });
  }

  // Lấy thông báo của một người dùng
  static async getUserNotifications(userId) {
    return await Notification.find({ notification_user: userId }).sort({ createdAt: -1 });
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
