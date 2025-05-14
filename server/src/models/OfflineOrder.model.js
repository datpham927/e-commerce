// models/OfflineOrder.js
'use strict';

const mongoose = require('mongoose');
const baseOrderFields = require('./baseOrderFields');
const { Schema } = mongoose;

const offlineOrderSchema = new Schema(
    {
        ...baseOrderFields,
        order_staff: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    },
    { timestamps: true },
);

offlineOrderSchema.post('save', async function (doc, next) {
    if (!doc.order_code) {
        doc.order_code = doc._id.toString().slice(0, 10).toUpperCase();
        await doc.constructor.findByIdAndUpdate(doc._id, { order_code: doc.order_code });
    }
    next();
});

module.exports = mongoose.model('OfflineOrder', offlineOrderSchema);
