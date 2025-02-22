"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema(
    {
        category_name: { type: String, required: true, unique: true }, // Tên danh mục
        category_thumb: { type: String, required: true }, // Hình ảnh của danh mục
        category_slug: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                return slugify(this.category_name, { lower: true });
            },
        }, // Slug của danh mục
    },
    {
        timestamps: true,
    }
);

// Middleware để tự động tạo slug từ tên danh mục trước khi lưu vào cơ sở dữ liệu
categorySchema.pre("save", function (next) {
    if (!this.category_slug) {
        this.category_slug = slugify(this.category_name, { lower: true });
    }
    console.log("Generated slug:", this.category_slug);
    next();
});

module.exports = mongoose.model("Category", categorySchema);
