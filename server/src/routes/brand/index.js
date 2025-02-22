const express = require("express");
const BrandController = require("../../controllers/brand.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

//tìm theo tên
router.get("/search", asyncHandle(BrandController.searchBrand));

// Thêm mới thương hiệu
router.post("/add", asyncHandle(BrandController.createBrand));

// Lấy danh sách tất cả thương hiệu
router.get("/all", asyncHandle(BrandController.getAllBrands));

// Lấy chi tiết thương hiệu theo ID
router.get("/:id", asyncHandle(BrandController.getBrandById));

// Cập nhật thương hiệu theo ID
router.put("/:id", asyncHandle(BrandController.updateBrand));

// Xóa thương hiệu theo ID
router.delete("/:id", asyncHandle(BrandController.deleteBrand));

module.exports = router;
