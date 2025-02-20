"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema({
    category_name: { type: String, required: true, unique: true }, // Tên danh mục
    category_thumb: { type: String, required: true }, // Hình ảnh của danh mục
    category_slug: { type: String, required: true }, // Slug của danh mục
}, {
    timestamps: true
});

// Middleware để tự động tạo slug từ tên danh mục trước khi lưu vào cơ sở dữ liệu
categorySchema.pre("save", function (next) {
    this.category_slug = slugify(this.category_name, { lower: true }); // Tạo slug tự động từ tên
    next();
});

// Export model để sử dụng trong các phần khác của ứng dụng
module.exports = mongoose.model("Category", categorySchema);
