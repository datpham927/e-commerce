"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        // ID user, liên kết tới User (nếu cần thao tác populate)
        notification_userId: { type: String, require: true },
        // Tên người dùng (nếu cần hiển thị)
        notification_userName: { type: String, required: true },
        // Tiêu đề thông báo
        notification_title: { type: String, required: true },
        // Nội dung phụ hoặc mô tả ngắn
        notification_subtitle: { type: String, required: true },
        // URL ảnh nếu có (banner, icon,...)
        notification_imageUrl: { type: String, default: "" },
        // Link điều hướng (khi người dùng bấm vào thông báo)
        notification_link: { type: String, default: "" },
        // Trạng thái đã xem hay chưa
        notification_isWatched: { type: Boolean, default: true },
    },
    {
        timestamps: true, // Tự động thêm createdAt & updatedAt
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
