// models/baseOrderFields.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const baseOrderFields = {
    order_products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 },
        },
    ],
    order_voucher: { type: Schema.Types.ObjectId, ref: 'Voucher' },
    order_total_price: { type: Number, required: true, default: 0, min: 0 },
    order_total_apply_discount: { type: Number, required: true, default: 0, min: 0 },
    order_payment_method: { type: String, required: true, enum: ['CASH', 'VNPAY', 'ONLINE', 'COIN', 'COIN+CASH'] },
    order_code: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
};

module.exports = baseOrderFields;
