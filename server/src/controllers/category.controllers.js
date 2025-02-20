const CategoryService = require("../services/category.service");

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCategories(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryById(req, res, next) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedCategory });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.status(200).json({ success: true, message: "Danh mục đã bị xóa" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoryController;
