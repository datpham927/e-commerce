"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const KeyTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        refPath: "user_type",
        required: true,
        index: true, // Tạo index để tối ưu truy vấn
    },
    user_type: {
        type: String,
        enum: ["User", "Admin"],
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
        select: false,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: [String],
        default: [],
        validate: [arrayLimit, "Chỉ được lưu tối đa 10 refresh tokens!"],
    },

}, { timestamps: true });

// Giới hạn số lượng refresh tokens
function arrayLimit(val) {
    return val.length <= 10;
}
// Tự động xóa refresh token cũ khi thêm mới
KeyTokenSchema.methods.addRefreshToken = function (token) {
    if (this.refreshTokensUsed.length >= 10) {
        this.refreshTokensUsed.shift(); // Xóa token cũ nhất
    }
    this.refreshTokensUsed.push(token);
    return this.save();
};

// Export model
module.exports = mongoose.model("KeyToken", KeyTokenSchema);
