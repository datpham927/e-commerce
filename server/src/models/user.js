const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    user_firstName: { type: String, default: "" },
    user_lastName: { type: String, default: "" },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String },
    user_address: { type: String },
    user_address_detail: { type: String },
    user_mobile: { type: String },
    user_voucher: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
    user_avatar_url: { type: String },
    user_passwordChangedAt: { type: String },
    user_confirm: { type: Boolean, default: false },
    user_verificationEmailToken: { type: String },
    user_passwordResetToken: { type: String },
    user_passwordTokenExpires: { type: String },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);