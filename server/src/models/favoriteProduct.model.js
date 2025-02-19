const mongoose = require("mongoose");

const favoriteProductSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Tạo chỉ mục để tránh trùng lặp (mỗi user chỉ có thể yêu thích 1 sản phẩm 1 lần)
favoriteProductSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);
