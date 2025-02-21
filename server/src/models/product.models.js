// productSchema
const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, unique: true },
    product_thumb: { type: String, required: true },
    product_price: { type: Number, required: true },
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
    product_discount: { type: Number, default: 0 },
    product_in_stock: { type: Number, default: 0 },
    product_category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    product_brand_id: { type: Schema.Types.ObjectId, ref: "Brand", required: true }, // yêu cầu thương hiệu
    product_views: { type: Number, default: 0 },
    product_image_features: { type: Array, default: [] },
    product_isPublished: { type: Boolean, default: true, index: true, select: false },
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
        next(error); // Nếu danh mục không tồn tại, trả về lỗi
    } else {
        // Kiểm tra xem thương hiệu có tồn tại không
        const brand = await mongoose.model("Brand").findById(this.product_brand_id);
        if (!brand) {
            const error = new Error("Brand does not exist");
            next(error); // Nếu thương hiệu không tồn tại, trả về lỗi
        } else {
            // Nếu tất cả đều tồn tại, tiếp tục lưu sản phẩm
            if (!this.product_slug) {
                this.product_slug = slugify(this.product_name, { lower: true });
            }
            next();
        }
    }
});

// Export model
module.exports = mongoose.model("Product", productSchema);
