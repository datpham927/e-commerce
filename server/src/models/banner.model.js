"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Banner Schema
 * Lưu trữ thông tin banner quảng cáo hiển thị trên website/app
 */
const bannerSchema = new Schema(
    {
        // Tiêu đề banner
        banner_title: { type: String, required: true, trim: true, },
        // Đường dẫn ảnh banner (URL)
        banner_imageUrl: { type: String, required: true, },
        // Link khi người dùng bấm vào banner
        banner_link: { type: String, default: "", },
        // Banner đang hoạt động hay không
        banner_isActive: { type: Boolean, default: true, },
        // Thời gian bắt đầu hiển thị banner (nếu có)
        banner_startDate: { type: Date, default: null, },
        // Thời gian kết thúc hiển thị banner (nếu có)
        banner_endDate: { type: Date, default: null, },
        // Mô tả hoặc ghi chú thêm về banner
        banner_description: { type: String, default: "", },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

module.exports = mongoose.model("Banner", bannerSchema);
