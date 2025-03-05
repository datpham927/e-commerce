const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema({
    supplier_name: { type: String, required: true },
    supplier_contact: { type: String, required: true },
    supplier_address: { type: String },
    supplier_email: { type: String, required: true },
    supplier_phone: { type: String, required: true },
    supplier_products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
