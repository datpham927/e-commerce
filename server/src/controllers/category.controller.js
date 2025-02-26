"use strict";

const CategoryService = require("../services/category.service");
class CategoryController {
    static async createCategory(req, res, next) {
        const category = await CategoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    }

    static async getAllCategories(req, res, next) {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    }

    static async getCategoryById(req, res, next) {
        const category = await CategoryService.getCategoryById(req.params.id);
        res.status(200).json({ success: true, data: category });
    }

    static async updateCategory(req, res, next) {
        const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedCategory });
    }

    static async deleteCategory(req, res, next) {
        await CategoryService.deleteCategory(req.params.id);
        res.status(200).json({ success: true, message: "Danh mục đã bị xóa" });
    }
    //tìm theo tên
    static async searchCategory(req, res, next) {
        const categories = await CategoryService.searchCategoryByName(req.query.name);
        res.status(200).json({ success: true, data: categories });
    }

}

module.exports = CategoryController;
