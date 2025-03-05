const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    user_reward_points: { type: Number, default: 0 }, // Điểm tích lũy khi đánh giá sản phẩm thành công
    user_name: { type: String, default: "" },
    user_email: { type: String, required: true, unique: true },
    user_type: { type: String, enum: ["admin", "user", "employee"], default: "user" },
    user_roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }], // Một user có thể có nhiều role
    user_password: { type: String },
    user_address: { type: String },
    user_mobile: { type: String, unique: true },
    user_voucher: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
    user_avatar_url: { type: String },
    user_passwordChangedAt: { type: Date },
    user_isBlocked: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
