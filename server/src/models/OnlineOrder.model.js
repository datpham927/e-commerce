'use strict';

const mongoose = require('mongoose');
const baseOrderFields = require('./baseOrderFields');
const { Schema } = mongoose;

const onlineOrderSchema = new Schema(
    {
        ...baseOrderFields,
        order_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        order_shipping_address: {
            fullName: { type: String, required: true },
            detailAddress: { type: String, required: true },
            village: { type: String, required: true },
            district: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String, required: true },
        },
        order_shipping_price: { type: Number, required: true, min: 0 },
        order_date_shipping: {
            from: { type: Date },
            to: { type: Date },
        },
        order_shipping_company: {
            type: Schema.Types.ObjectId,
            ref: 'ShippingCompany',
            required: true,
        },
        order_status: {
            type: String,
            enum: ['pending', 'confirm', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        order_refunded: { type: Boolean, default: false }, // ✅ Đã hoàn tiền hay chưa
        order_amount_paid: { type: Number, required: true, min: 0 }, // Số tiền đã trả
        order_amount_due: { type: Number, required: true, min: 0 }, // Thêm trường số tiền cần trả
    },
    { timestamps: true },
);

onlineOrderSchema.post('save', async function (doc, next) {
    if (!doc.order_code) {
        const generatedCode = 'OD' + doc._id.toString().slice(-6).toUpperCase();
        doc.order_code = generatedCode;
        await doc.constructor.findByIdAndUpdate(doc._id, { order_code: generatedCode });
    }
    next();
});

module.exports = mongoose.model('OnlineOrder', onlineOrderSchema);
