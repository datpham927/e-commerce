const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_type: {
        type: String,
        enum: ["online", "offline"],
        required: true,
        default: "online"
    }, // Đơn hàng online hoặc tại quầy
    order_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // order_user: ID của người dùng liên kết với đơn hàng
    order_products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true }, // Giá gốc sản phẩm tại thời điểm mua.
        }],
    // Mã giảm giá (nếu có)
    order_voucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
    order_total_price: { type: Number, required: true, default: 0, min: 0 }, // order_total_price: Tổng giá trị đơn hàng
    order_payment_method: { type: String, required: true, enum: ["cash", "vnpay", 'momo'] }, // order_payment_method: Phương thức thanh toán
    order_status: { type: String, enum: ["pending", "confirm", "shipped", "delivered", "cancelled"], default: "pending" }, // order_status: Trạng thái đơn hàng hiện tại
    // order_status_history: Lịch sử thay đổi trạng thái cùng thời gian thay đổi
    order_status_history: [{
        status: { type: String, enum: ["pending", "confirm", "shipped", "delivered", "cancelled"] },
        timestamp: { type: Date, default: Date.now }
    }],
    order_shipping_address: {
        fullName: { type: String, required: true },
        detailAddress: { type: String, required: true },
        village: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true }
    }, // Thông tin địa chỉ giao hàng (tên, địa chỉ chi tiết, xã/phường, quận/huyện, thành phố, số điện thoại)
    order_shipping_price: { type: Number, required: true, min: 0 }, // Phí giao hàng
    order_date_shipping: {
        from: { type: Date, },
        to: { type: Date, },
    }, //Ngày giao hàng dự kiến (có thể để trống)
    order_shipping_company: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingCompany", required: true },
}, { timestamps: true }); //tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Order", orderSchema);
