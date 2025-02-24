const ShippingCompany = require("../models/shippingCompany.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const ShippingCompanyService = {
    // Tạo công ty vận chuyển mới
    createShippingCompany: async (payload) => {
        if (!payload.sc_name || !payload.sc_phone || !payload.sc_shipping_price) {
            throw new BadRequestError("Thiếu thông tin bắt buộc!");
        }
        return await ShippingCompany.create(payload);
    },

    // Lấy danh sách tất cả công ty vận chuyển
    getAllShippingCompanies: async () => {
        return await ShippingCompany.find();
    },

    // Lấy công ty vận chuyển theo ID
    getShippingCompanyById: async (id) => {
        const shippingCompany = await ShippingCompany.findById(id);
        if (!shippingCompany) throw new NotFoundError("Công ty vận chuyển không tồn tại!");
        return shippingCompany;
    },

    // Cập nhật công ty vận chuyển theo ID
    updateShippingCompany: async (id, payload) => {
        const updatedShippingCompany = await ShippingCompany.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedShippingCompany) throw new NotFoundError("Công ty vận chuyển không tồn tại!");
        return updatedShippingCompany;
    },

    // Xóa công ty vận chuyển theo ID
    deleteShippingCompany: async (id) => {
        const shippingCompany = await ShippingCompany.findByIdAndDelete(id);
        if (!shippingCompany) throw new NotFoundError("Công ty vận chuyển không tồn tại!");
        return shippingCompany;
    },

    // Tìm kiếm công ty vận chuyển theo tên
    searchShippingCompaniesByName: async (name) => {
        if (!name) throw new BadRequestError("Vui lòng nhập tên công ty để tìm kiếm");

        const companies = await ShippingCompany.find({
            sc_name: { $regex: name, $options: "i" } // Tìm kiếm không phân biệt hoa thường
        });

        if (companies.length === 0) throw new NotFoundError("Không tìm thấy công ty nào");

        return companies;
    }
};

module.exports = ShippingCompanyService;
