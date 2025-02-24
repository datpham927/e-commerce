"use strict";

const BrandService = require("../services/brand.service");

class BrandController {
    // Thêm thương hiệu mới
    static async createBrand(req, res, next) {
        const brand = await BrandService.createBrand(req.body);
        res.status(201).json({ success: true, data: brand });
    }

    // Lấy danh sách tất cả thương hiệu
    static async getAllBrands(req, res, next) {
        const brands = await BrandService.getAllBrands();
        res.status(200).json({ success: true, data: brands });
    }

    // Lấy chi tiết thương hiệu theo ID
    static async getBrandById(req, res, next) {
        const brand = await BrandService.getBrandById(req.params.id);
        res.status(200).json({ success: true, data: brand });
    }

    // Cập nhật thương hiệu theo ID
    static async updateBrand(req, res, next) {
        const updatedBrand = await BrandService.updateBrand(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedBrand });
    }

    // Xóa thương hiệu theo ID
    static async deleteBrand(req, res, next) {
        await BrandService.deleteBrand(req.params.id);
        res.status(200).json({ success: true, message: "Xóa thương hiệu thành công!" });
    }

    // 🔹 Tìm kiếm thương hiệu theo tên
    static async searchBrand(req, res, next) {
        const brands = await BrandService.searchBrandByName(req.query.name);
        res.status(200).json({ success: true, data: brands });
    }
}

module.exports = BrandController;
