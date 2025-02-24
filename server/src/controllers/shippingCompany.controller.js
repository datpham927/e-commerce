"use strict";

const ShippingCompanyService = require("../services/shippingCompany.service");

class ShippingCompanyController {
    // Thêm công ty vận chuyển mới
    static async createShippingCompany(req, res, next) {
        const shippingCompany = await ShippingCompanyService.createShippingCompany(req.body);
        res.status(201).json({ success: true, data: shippingCompany });
    }

    // Lấy danh sách tất cả công ty vận chuyển
    static async getAllShippingCompanies(req, res, next) {
        const shippingCompanies = await ShippingCompanyService.getAllShippingCompanies();
        res.status(200).json({ success: true, data: shippingCompanies });
    }

    // Lấy chi tiết công ty vận chuyển theo ID
    static async getShippingCompanyById(req, res, next) {
        const shippingCompany = await ShippingCompanyService.getShippingCompanyById(req.params.id);
        res.status(200).json({ success: true, data: shippingCompany });
    }

    // Cập nhật công ty vận chuyển theo ID
    static async updateShippingCompany(req, res, next) {
        const updatedShippingCompany = await ShippingCompanyService.updateShippingCompany(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedShippingCompany });
    }

    // Xóa công ty vận chuyển theo ID
    static async deleteShippingCompany(req, res, next) {
        await ShippingCompanyService.deleteShippingCompany(req.params.id);
        res.status(200).json({ success: true, message: "Xóa công ty vận chuyển thành công!" });
    }

    // Tìm kiếm công ty vận chuyển theo tên
    static async searchShippingCompanies(req, res, next) {
        const { name } = req.query;
        const companies = await ShippingCompanyService.searchShippingCompaniesByName(name);
        res.status(200).json({ success: true, data: companies });
    }
}

module.exports = ShippingCompanyController;
