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

favoriteProductSchema.index({ fp_user_id: 1 }, { unique: true });
module.exports = mongoose.models.FavoriteProduct || mongoose.model("FavoriteProduct", favoriteProductSchema);
