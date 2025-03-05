const express = require("express");
const BrandController = require("../../controllers/brand.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();
// Lấy danh sách tất cả thương hiệu
router.get("/all", asyncHandle(BrandController.getAllBrands));
router.get("/:cid/by-category", asyncHandle(BrandController.getBrandsInCategory));
router.use(authentication)
router.use(restrictTo(PERMISSIONS.BRAND_MANAGE))
// Tìm kiếm thương hiệu theo tên
router.get("/search", asyncHandle(BrandController.searchBrand));
// Thêm mới thương hiệu
router.post("/add", asyncHandle(BrandController.createBrand));
// Lấy chi tiết thương hiệu theo ID
router.get("/:id/search", asyncHandle(BrandController.getBrandById));
// Cập nhật thương hiệu theo ID
router.put("/:id/update", asyncHandle(BrandController.updateBrand));
// Xóa thương hiệu theo ID
router.delete("/:id/delete", asyncHandle(BrandController.deleteBrand));

module.exports = router;
