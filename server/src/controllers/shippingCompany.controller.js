const ShippingCompanyService = require("../services/shippingCompany.service");

const ShippingCompanyController = {
    // Thêm công ty vận chuyển mới
    createShippingCompany: async (req, res) => {
        const shippingCompany = await ShippingCompanyService.createShippingCompany(req.body);
        res.status(201).json({ success: true, data: shippingCompany });
    },

    // Lấy danh sách tất cả công ty vận chuyển
    getAllShippingCompanies: async (req, res) => {
        const shippingCompanies = await ShippingCompanyService.getAllShippingCompanies();
        res.status(200).json({ success: true, data: shippingCompanies });
    },

    // Lấy chi tiết công ty vận chuyển theo ID
    getShippingCompanyById: async (req, res) => {
        const shippingCompany = await ShippingCompanyService.getShippingCompanyById(req.params.id);
        res.status(200).json({ success: true, data: shippingCompany });
    },

    // Cập nhật công ty vận chuyển theo ID
    updateShippingCompany: async (req, res) => {
        const updatedShippingCompany = await ShippingCompanyService.updateShippingCompany(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedShippingCompany });
    },

    // Xóa công ty vận chuyển theo ID
    deleteShippingCompany: async (req, res) => {
        await ShippingCompanyService.deleteShippingCompany(req.params.id);
        res.status(200).json({ success: true, message: "Xóa công ty vận chuyển thành công!" });
    }
};

module.exports = ShippingCompanyController;
