"use strict"
const { Schema } = require('mongoose');
const slugify = require("slugify");

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema({
    // Tên sản phẩm, bắt buộc phải có
    product_name: { type: String, required: true },
    // Slug của sản phẩm, sẽ được tạo tự động nếu không có
    product_slug: { type: String, unique: true },
    // Hình ảnh đại diện của sản phẩm, bắt buộc phải có
    product_thumb: { type: String, required: true },
    // Giá sản phẩm, bắt buộc phải có
    product_price: { type: Number, required: true },
    // Mô tả chi tiết về sản phẩm, bắt buộc phải có
    product_description: { type: String, required: true },
    // Số lượng sản phẩm, bắt buộc phải có
    product_quantity: { type: Number, required: true },
    // Thuộc tính của sản phẩm (ví dụ: xuất sứ, hạn sử dụng,...), bắt buộc phải có
    product_attribute: { type: Schema.Types.Mixed, required: true },
    // Đánh giá của sản phẩm, mặc định là 4.5, giới hạn từ 1 đến 5 và làm tròn đến 1 chữ số thập phân
    product_ratings: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10  // Làm tròn đánh giá
    },
    // Các trường mới được thêm vào để tối ưu hóa thông tin về sản phẩm
    product_sold: { type: Number, default: 0 }, // Số lượng đã bán, mặc định là 0
    product_discount: { type: Number, default: 0 }, // Giảm giá cho sản phẩm, mặc định là 0 đơn vị %
    product_in_stock: { type: Number, default: 0 }, // Số lượng còn trong kho, mặc định là 0
    product_category_code: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    product_brand_code: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    // Số lượt xem của sản phẩm, mặc định là 0
    product_views: { type: Number, default: 0 },
    // Liên kết đến người dùng đã tạo sản phẩm (tham chiếu đến mô hình "User")
    product_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Các tính năng hình ảnh sản phẩm,lưu trữ các đặc trưng của hình ảnh dưới dạng array
    product_image_features: { type: Array, default: [] },
    // Trạng thái ẩn sản phẩm, mặc định là true và không được chọn khi truy vấn
    product_isDraft: { type: Boolean, default: false, index: true, select: false },
    // Trạng thái đã xuất bản của sản phẩm, mặc định là true và không được chọn khi truy vấn
    product_isPublished: { type: Boolean, default: true, index: true, select: false },
}, {
    // Tự động tạo các trường timestamp cho thời gian tạo và cập nhật
    timestamps: true
});

// Tạo chỉ mục văn bản cho các trường tên và mô tả sản phẩm để tối ưu hóa tìm kiếm
productSchema.index({ product_name: 'text', product_description: 'text' });

// Middleware để tự động tạo slug từ tên sản phẩm trước khi lưu vào cơ sở dữ liệu
productSchema.pre("save", function (next) {
    if (!this.product_slug) {
        this.product_slug = slugify(this.product_name, { lower: true });
    }
    next();  // Tiến hành lưu sản phẩm
});

// Export model để sử dụng trong các phần khác của ứng dụng
module.exports = mongoose.model("Product", productSchema);
