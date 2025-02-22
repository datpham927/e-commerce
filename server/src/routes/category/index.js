const express = require("express");
const CategoryController = require("../../controllers/category.controller");
const asyncHandle = require("../../helper/asyncHandle");
const router = express.Router();

// Tìm kiếm danh mục theo tên
router.get("/search", asyncHandle(CategoryController.searchCategory));

// Tạo danh mục mới
router.post("/add", asyncHandle(CategoryController.createCategory));

// Lấy tất cả danh mục
router.get("/all", asyncHandle(CategoryController.getAllCategories));

// Lấy danh mục theo ID
router.get("/search/:id", asyncHandle(CategoryController.getCategoryById));

// Cập nhật danh mục
router.put("/update/:id", asyncHandle(CategoryController.updateCategory));

// Xóa danh mục
router.delete("/delete/:id", asyncHandle(CategoryController.deleteCategory));

module.exports = router;