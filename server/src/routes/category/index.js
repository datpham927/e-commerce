const express = require("express");
const CategoryController = require("../../controllers/category.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();
router.use(authentication)
router.use(restrictTo(PERMISSIONS.CATEGORY_MANAGE))
// Tìm kiếm danh mục theo tên
router.get("/search", asyncHandle(CategoryController.searchCategory));
// Tạo danh mục mới
router.post("/add", asyncHandle(CategoryController.createCategory));
// Lấy tất cả danh mục
router.get("/all", asyncHandle(CategoryController.getAllCategories));
// Lấy danh mục theo ID
router.get("/:id/search", asyncHandle(CategoryController.getCategoryById));
// Cập nhật danh mục
router.put("/:id/update", asyncHandle(CategoryController.updateCategory));
// Xóa danh mục
router.delete("/:id/delete", asyncHandle(CategoryController.deleteCategory));

module.exports = router;
