const mongoose = require("mongoose");

const shippingCompanySchema = new mongoose.Schema({
    sc_name: { type: String, required: true },
    sc_phone: { type: String, required: true },
    sc_email: { type: String, required: false },
    // Địa chỉ 
    sc_address: {
        sc_street: { type: String, required: false }, // Địa chỉ đường/phố
        sc_district: { type: String, required: false }, // Quận/Huyện
        sc_state: { type: String, required: false },   // Tỉnh/Thành phố
    },
    // Trạng thái hoạt động của công ty (Có hoạt động hay không)
    sc_active: { type: Boolean, default: true },
    // Mức giá giao hàng  
    sc_shipping_price: { type: Number, required: true, min: 0 },
    // thời gian vận chuyển
    sc_delivery_time: {
        from: { type: Number, default: 7 }, // tối thiểu 7 ngày
        to: { type: Number, default: 10 },  // tối đa 10 ngày
    }
}, { timestamps: true });

module.exports = mongoose.model("ShippingCompany", shippingCompanySchema);
