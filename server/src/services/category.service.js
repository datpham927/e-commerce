"use strict";

const { BadRequestRequestError, NotFoundError } = require("../core/error.response");
const Category = require("../models/category.model");

class CategoryService {
    // Tạo danh mục mới
    static async createCategory(payload) {
        if (!payload.category_name || !payload.category_thumb) {
            throw new BadRequestRequestError("Vui lòng cung cấp đầy đủ dữ liệu");
        }
        return await Category.create(payload);
    }

    // Lấy tất cả danh mục
    static async getAllCategories() {
        return await Category.find({});
    }

    // Lấy danh mục theo ID
    static async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) throw new NotFoundError("Không tìm thấy danh mục");
        return category;
    }

    // Cập nhật danh mục
    static async updateCategory(categoryId, updateData) {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedCategory) throw new NotFoundError("Không tìm thấy danh mục");
        return updatedCategory;
    }

    // Xóa danh mục
    static async deleteCategory(categoryId) {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) throw new NotFoundError("Không tìm thấy danh mục");
        return deletedCategory;
    }
}

module.exports = CategoryService;
