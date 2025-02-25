const mongoose = require("mongoose");

const favoriteProductSchema = new mongoose.Schema(
    {
        fp_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fp_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    },
    { timestamps: true }
);

// Chỉ mục giúp mỗi user chỉ có thể yêu thích một sản phẩm một lần
favoriteProductSchema.index({ fp_user_id: 1, fp_product: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);
