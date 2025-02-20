const mongoose = require("mongoose");

const favoriteProductSchema = mongoose.Schema(
    {
        fp_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fp_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    },
    {
        timestamps: true,
    }
);

// Tạo chỉ mục để tránh trùng lặp (mỗi user chỉ có thể yêu thích 1 sản phẩm 1 lần)
favoriteProductSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);
