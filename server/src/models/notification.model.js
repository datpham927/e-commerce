"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    notification_user: { type: String, required: true }, // 'all' hoặc userId
    notification_userName: { type: String }, // Tên người dùng nếu có
    notification_title: { type: String, required: true }, // Tiêu đề
    notification_subtitle: { type: String, required: true }, // Mô tả ngắn
    notification_imageUrl: { type: String, default: "" }, // Ảnh nếu có
    notification_link: { type: String, default: "" }, // Link điều hướng
    notification_isWatched: { type: Boolean, default: false }, // Trạng thái xem
  },
  {
    timestamps: true, // Tự động thêm createdAt & updatedAt
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
