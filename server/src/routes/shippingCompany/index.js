const express = require("express");
const ShippingCompanyController = require("../../controllers/shippingCompany.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

// Tìm kiếm công ty vận chuyển theo tên
router.get("/search", asyncHandle(ShippingCompanyController.searchShippingCompanies));

// Thêm mới công ty vận chuyển
router.post("/add", asyncHandle(ShippingCompanyController.createShippingCompany));

// Lấy danh sách tất cả công ty vận chuyển
router.get("/all", asyncHandle(ShippingCompanyController.getAllShippingCompanies));

// Lấy chi tiết công ty vận chuyển theo ID
router.get("/:id/search", asyncHandle(ShippingCompanyController.getShippingCompanyById));

// Cập nhật công ty vận chuyển theo ID
router.put("/:id/update", asyncHandle(ShippingCompanyController.updateShippingCompany));

// Xóa công ty vận chuyển theo ID
router.delete("/:id/delete", asyncHandle(ShippingCompanyController.deleteShippingCompany));

module.exports = router;
