"use strict";
const mongoose = require("mongoose");

const favoriteProductSchema = new mongoose.Schema(
    {
        fp_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fp_products: [{  // Sử dụng mảng để chứa nhiều product IDs
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }],
    },
    { timestamps: true }
);

// Chỉ mục để đảm bảo không có product trùng lặp trong mảng của cùng một user
favoriteProductSchema.index({ fp_user_id: 1 }, { unique: true });

// Kiểm tra nếu model chưa được tạo thì mới tạo
module.exports = mongoose.models.FavoriteProduct || mongoose.model("FavoriteProduct", favoriteProductSchema);
