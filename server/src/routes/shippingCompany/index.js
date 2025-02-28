const express = require("express");
const ShippingCompanyController = require("../../controllers/shippingCompany.controller");
const asyncHandle = require("../../helper/asyncHandle");
const PERMISSIONS = require("../../config/permissions");
const { authentication } = require("../../middlewares/authMiddleware");
const { restrictTo } = require('../../middlewares/authMiddleware'); // hoặc đường dẫn đúng


const router = express.Router();


// Lấy danh sách tất cả công ty vận chuyển
router.get("/all", asyncHandle(ShippingCompanyController.getAllShippingCompanies));
router.use(authentication)
router.use(restrictTo(PERMISSIONS.SHIPPING_COMPANY_MANAGE))
// Tìm kiếm công ty vận chuyển theo tên
router.get("/search", asyncHandle(ShippingCompanyController.searchShippingCompanies));
// Thêm mới công ty vận chuyển
router.post("/add", asyncHandle(ShippingCompanyController.createShippingCompany));
// Lấy chi tiết công ty vận chuyển theo ID
router.get("/:id/search", asyncHandle(ShippingCompanyController.getShippingCompanyById));
// Cập nhật công ty vận chuyển theo ID
router.put("/:id/update", asyncHandle(ShippingCompanyController.updateShippingCompany));
// Xóa công ty vận chuyển theo ID
router.delete("/:id/delete", asyncHandle(ShippingCompanyController.deleteShippingCompany));

module.exports = router;
