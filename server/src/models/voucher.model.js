"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoucherSchema = new Schema({
    voucher_name: { type: String, required: true, unique: true },  // Tên voucher, phải duy nhất
    voucher_description: { type: String, required: true },  // Mô tả voucher
    voucher_type: { type: String, enum: ["system", "user"], default: "system" }, // "system" (hệ thống) hoặc "user" (do user đổi điểm)
    voucher_thumb: { type: String, required: true }, // Hình thumbnail
    voucher_banner_image: { type: String, required: true }, // Hình banner quảng cáo
    voucher_method: { type: String, enum: ["percent", "fixed"], required: true }, // "percent" hoặc "fixed"
    voucher_value: { type: Number, required: true }, // Giá trị giảm giá (VD: 10% hoặc 50,000 VND)
    voucher_max_price: { type: Number, default: null }, // Mức giảm tối đa (nếu là percent)
    voucher_code: { type: String, required: true, unique: true }, // Mã giảm giá
    voucher_start_date: { type: Date, required: true },
    voucher_end_date: { type: Date, required: true },
    voucher_max_uses: { type: Number, required: true }, // Số lần tối đa mã giảm giá có thể được sử dụng
    voucher_uses_count: { type: Number, default: 0 }, // Số lần đã sử dụng
    voucher_max_uses_per_user: { type: Number, required: true }, // Giới hạn số lần một người có thể sử dụng voucher này
    voucher_users_used: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // danh sách người đã sử dụng
    voucher_min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu để áp dụng voucher
    voucher_is_active: { type: Boolean, default: true },
    voucher_required_points: { type: Number, default: 0 } // Điểm tích lũy cần thiết để đổi voucher
}, {
    timestamps: true // Tự động thêm createdAt, updatedAt
});

// Middleware kiểm tra trùng lặp voucher_name và voucher_code
const checkVoucherUnique = async function (next) {
    const voucher = this instanceof mongoose.Document ? this : this._update; // Kiểm tra xem là document hay update operation

    try {
        // Kiểm tra trùng voucher_name
        const existingVoucherByName = await mongoose.model('Voucher').findOne({
            voucher_name: voucher.voucher_name
        });

        if (existingVoucherByName && existingVoucherByName._id.toString() !== (voucher._id ? voucher._id.toString() : null)) {
            return next(new Error('Voucher name đã tồn tại!'));
        }

        // Kiểm tra trùng voucher_code
        const existingVoucherByCode = await mongoose.model('Voucher').findOne({
            voucher_code: voucher.voucher_code
        });

        if (existingVoucherByCode && existingVoucherByCode._id.toString() !== (voucher._id ? voucher._id.toString() : null)) {
            return next(new Error('Voucher code đã tồn tại!'));
        }

        next(); // Nếu không có lỗi, tiếp tục
    } catch (error) {
        next(error); // Xử lý lỗi
    }
};

// Áp dụng middleware cho cả các thao tác save và update
VoucherSchema.pre(['save', 'findOneAndUpdate', 'updateOne'], checkVoucherUnique);

// Export model
module.exports = mongoose.model('Voucher', VoucherSchema);
