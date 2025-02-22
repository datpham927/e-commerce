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
        banner_title: { 
            type: String, 
            required: true, 
            trim: true, 
            unique: true  // Đảm bảo tiêu đề banner là duy nhất trong cơ sở dữ liệu
        },
        // Đường dẫn ảnh banner (URL)
        banner_imageUrl: { 
            type: String, 
            required: true, 
        },
        // Link khi người dùng bấm vào banner
        banner_link: { 
            type: String, 
            default: "", 
        },
        // Banner đang hoạt động hay không
        banner_isActive: { 
            type: Boolean, 
            default: true, 
        },
        // Thời gian bắt đầu hiển thị banner (nếu có)
        banner_startDate: { 
            type: Date, 
            default: null, 
        },
        // Thời gian kết thúc hiển thị banner (nếu có)
        banner_endDate: { 
            type: Date, 
            default: null, 
        },
        // Mô tả hoặc ghi chú thêm về banner
        banner_description: { 
            type: String, 
            default: "", 
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Middleware kiểm tra trùng lặp tiêu đề banner trước khi lưu
bannerSchema.pre('save', async function(next) {
    const existingBanner = await mongoose.model('Banner').findOne({ banner_title: this.banner_title });
    if (existingBanner) {
        const error = new Error('Tiêu đề banner đã tồn tại!');
        next(error);  // Trả về lỗi nếu tiêu đề banner đã tồn tại
    } else {
        next();  // Tiếp tục lưu dữ liệu nếu không có lỗi
    }
});

// Middleware kiểm tra trùng lặp tiêu đề banner khi cập nhật
bannerSchema.pre('findOneAndUpdate', async function(next) {
    const { banner_title } = this._update;
    if (!banner_title) return next(); // Không cần kiểm tra nếu không có thay đổi title

    // Tìm banner khác có cùng tiêu đề, trừ chính banner đang được cập nhật
    const existingBanner = await mongoose.model('Banner').findOne({
        banner_title: banner_title,
        _id: { $ne: this._conditions._id }  // Tránh trùng chính bản thân
    });

    if (existingBanner) {
        const error = new Error('Tiêu đề banner đã tồn tại!');
        next(error);  // Trả về lỗi nếu tiêu đề banner đã tồn tại
    } else {
        next();  // Tiếp tục nếu không có lỗi
    }
    
});

module.exports = mongoose.model("Banner", bannerSchema);
