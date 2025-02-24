const express = require("express");
const BrandController = require("../../controllers/brand.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

// Tìm kiếm thương hiệu theo tên
router.get("/search", asyncHandle(BrandController.searchBrand));

// Thêm mới thương hiệu
router.post("/add", asyncHandle(BrandController.createBrand));

// Lấy danh sách tất cả thương hiệu
router.get("/all", asyncHandle(BrandController.getAllBrands));

// Lấy chi tiết thương hiệu theo ID
router.get("/:id/search", asyncHandle(BrandController.getBrandById));

// Cập nhật thương hiệu theo ID
router.put("/:id/update", asyncHandle(BrandController.updateBrand));

// Xóa thương hiệu theo ID
router.delete("/:id/delete", asyncHandle(BrandController.deleteBrand));

module.exports = router;
