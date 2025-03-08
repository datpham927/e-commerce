const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify'); // Chỉ khai báo một lần

const supplierSchema = new Schema({
    supplier_name: { type: String, required: true },
    supplier_contact: { type: String, required: true },
    supplier_address: { type: String },
    supplier_email: { type: String, required: true },
    supplier_phone: { type: String, required: true },
    supplier_description: { type: String },
    supplier_slug: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Middleware tạo slug tự động trước khi lưu vào database
supplierSchema.pre('save', function (next) {
    if (!this.supplier_slug) {
        this.supplier_slug = slugify(this.supplier_name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Supplier', supplierSchema);
