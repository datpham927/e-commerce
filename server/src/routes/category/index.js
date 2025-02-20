const express = require("express");
const CategoryController = require("../../controllers/category.controllers");
const asyncHandle = require("../../helper/asyncHandle");
const router = express.Router();

// Tạo danh mục mới
router.post("/add", asyncHandle(CategoryController.createCategory));

// Lấy tất cả danh mục
router.get("/all", asyncHandle(CategoryController.getAllCategories));

// Lấy danh mục theo ID
router.get("/:id", asyncHandle(CategoryController.getCategoryById));

// Cập nhật danh mục
router.put("/:id", asyncHandle(CategoryController.updateCategory));

// Xóa danh mục
router.delete("/:id", asyncHandle(CategoryController.deleteCategory));

module.exports = router;