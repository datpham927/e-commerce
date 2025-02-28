"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const supplierSchema = new Schema(
  {
    supplier_name: { type: String, required: true, unique: true },
    supplier_slug: { type: String, unique: true },
    supplier_contact: { type: String, required: true },
    supplier_email: { type: String, required: true, unique: true },
    supplier_address: { type: String },
    supplier_phone: { type: String, required: true },
    supplier_description: { type: String },
    supplier_isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Tạo slug tự động khi tạo mới hoặc cập nhật nhà cung cấp
supplierSchema.pre("save", function (next) {
  if (!this.supplier_slug) {
    this.supplier_slug = slugify(this.supplier_name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Supplier", supplierSchema);
