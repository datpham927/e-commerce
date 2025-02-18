"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DiscountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, enum: ["system", "user"], default: "system" }, // "system" (hệ thống) hoặc "user" (do user đổi điểm)
    discount_thumb: { type: String, required: true }, // Hình thumbnail
    discount_banner_image: { type: String, required: true }, // Hình banner quảng cáo
    // Hỗ trợ cả giảm giá theo % và theo số tiền cố định
    discount_method: { type: String, enum: ["percent", "fixed"], required: true }, // "percent" hoặc "fixed"
    discount_value: { type: Number, required: true }, // Giá trị giảm giá (VD: 10% hoặc 50,000 VND)
    discount_max_price: { type: Number, default: null }, // Mức giảm tối đa (nếu là percent)
    discount_code: { type: String, required: true, unique: true }, // Mã giảm giá
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    // Số lần tối đa mã giảm giá có thể được sử dụng
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, default: 0 }, // Số lần đã sử dụng
    // Giới hạn số lần một người có thể sử dụng voucher này
    discount_max_uses_per_user: { type: Number, required: true },
    // danh sách người đã sử dụng
    discount_users_used: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Giá trị đơn hàng tối thiểu để áp dụng voucher
    discount_min_order_value: { type: Number, required: true },
    discount_is_active: { type: Boolean, default: true },
    // Voucher áp dụng cho tất cả hay chỉ một số sản phẩm
    discount_applies_to: { type: String, required: true, enum: ["all", "specific"] },
    // Danh sách sản phẩm được áp dụng (nếu discount_applies_to === "specific")
    discount_product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Điểm tích lũy cần thiết để đổi voucher (chỉ áp dụng khi discount_type = "user")
    discount_required_points: { type: Number, default: 0 }
}, {
    timestamps: true // Tự động thêm createdAt, updatedAt
});

// Export model
module.exports = mongoose.model('Discount', DiscountSchema);
