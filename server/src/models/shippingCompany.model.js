const mongoose = require("mongoose");

const shippingCompanySchema = new mongoose.Schema({
    sc_name: { 
        type: String, 
        required: true, 
        unique: true,  // Đảm bảo tên công ty là duy nhất ở cấp cơ sở dữ liệu
        trim: true     // Cắt bỏ khoảng trắng thừa
    },
    sc_phone: { 
        type: String, 
        required: true 
    },
    sc_email: { 
        type: String, 
        required: false 
    },
    // Địa chỉ 
    sc_address: {
        sc_street: { 
            type: String, 
            required: false 
        },
        sc_district: { 
            type: String, 
            required: false 
        },
        sc_state: { 
            type: String, 
            required: false 
        },
    },
    // Trạng thái hoạt động của công ty
    sc_active: { 
        type: Boolean, 
        default: true 
    },
    // Mức giá giao hàng  
    sc_shipping_price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    // thời gian vận chuyển
    sc_delivery_time: {
        from: { 
            type: Number, 
            default: 7 
        }, // tối thiểu 7 ngày
        to: { 
            type: Number, 
            default: 10 
        },  // tối đa 10 ngày
    }
}, { timestamps: true });

// Middleware kiểm tra trùng lặp trước khi lưu vào cơ sở dữ liệu (pre-save)
shippingCompanySchema.pre('save', async function(next) {
    const existingCompany = await mongoose.model('ShippingCompany').findOne({ sc_name: this.sc_name });
    if (existingCompany) {
        const error = new Error('Tên công ty đã tồn tại!');
        next(error);  // Trả về lỗi nếu tên công ty đã tồn tại
    } else {
        next();  // Tiếp tục lưu dữ liệu nếu không có lỗi
    }
});

module.exports = mongoose.model("ShippingCompany", shippingCompanySchema);
