const mongoose = require("mongoose");

const userVoucher = new mongoose.Schema(
    {
        vc_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        vc_vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voucher", required: true }],
    },
    { timestamps: true }
);

// Chỉ mục giúp mỗi user chỉ có thể yêu thích một sản phẩm một lần
userVoucher.index({ vc_user_id: 1, vc_vouchers: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteProduct", userVoucher);