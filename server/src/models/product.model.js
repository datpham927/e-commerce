"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, unique: true },
    product_thumb: { type: String, required: true },
    product_images: [{ type: String, required: true }],
    product_price: { type: Number, required: true },
    product_discount: { type: Number, default: 0 }, // %
    product_description: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_attribute: { type: Schema.Types.Mixed, required: true },
    product_ratings: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10  // Làm tròn đánh giá
    },
    product_sold: { type: Number, default: 0 },
    product_category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    product_brand_id: { type: Schema.Types.ObjectId, ref: "Brand", required: true }, // yêu cầu thương hiệu
    product_views: { type: Number, default: 0 },
    product_image_features: { type: Array, default: [] },
    product_isPublished: { type: Boolean, default: true, index: true, select: false },
    product_stock: { type: Number, required: true, default: 0 }, // Số lượng hàng tồn kho
}, {
    timestamps: true
});

// Tạo chỉ mục văn bản cho các trường tên và mô tả sản phẩm
productSchema.index({ product_name: 'text', product_description: 'text' });
// Middleware kiểm tra tồn tại của danh mục và thương hiệu
productSchema.pre("save", async function (next) {
    // Kiểm tra xem danh mục có tồn tại không
    const category = await mongoose.model("Category").findById(this.product_category_id);
    if (!category) {
        const error = new Error("Category does not exist");
        return next(error); // Nếu danh mục không tồn tại, trả về lỗi
    }

    // Kiểm tra xem thương hiệu có tồn tại không
    const brand = await mongoose.model("Brand").findById(this.product_brand_id);
    if (!brand) {
        const error = new Error("Brand does not exist");
        return next(error); // Nếu thương hiệu không tồn tại, trả về lỗi
    }

    // Kiểm tra nếu product_name đã tồn tại trong cơ sở dữ liệu
    const existingProduct = await mongoose.model("Product").findOne({ product_name: this.product_name });
    if (existingProduct && existingProduct._id.toString() !== this._id.toString()) {
        const error = new Error("Product name already exists!");
        return next(error); // Nếu tên sản phẩm đã tồn tại, trả về lỗi
    }

    // Tạo slug nếu chưa có
    if (!this.product_slug) {
        this.product_slug = slugify(this.product_name, { lower: true });
    }

    next();
});

// Middleware kiểm tra trùng lặp product_name trước khi cập nhật
productSchema.pre("findOneAndUpdate", async function (next) {
    const updatedProduct = this.getUpdate();
    const productName = updatedProduct.product_name;

    // Kiểm tra nếu product_name đã tồn tại trong cơ sở dữ liệu
    if (productName) {
        const existingProduct = await mongoose.model("Product").findOne({ product_name: productName });
        if (existingProduct && existingProduct._id.toString() !== this._conditions._id.toString()) {
            const error = new Error("sản phẩm đã tồn tại!");
            return next(error); // Nếu tên sản phẩm đã tồn tại, trả về lỗi
        }
    }

    next();
});

// Export model
module.exports = mongoose.model("Product", productSchema);
