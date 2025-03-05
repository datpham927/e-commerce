const express = require("express");
const SupplierController = require("../../controllers/supplier.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication } = require("../../middlewares/authMiddleware");


const router = express.Router();

// API lấy lịch sử nhập hàng
router.get("/import-history", SupplierController.getImportHistory);

// Áp dụng middleware authentication
router.use(authentication);

// Route thêm nhà cung cấp mới
router.post("/add", asyncHandle(SupplierController.createSupplier));

// Route lấy danh sách nhà cung cấp
router.get("/all", asyncHandle(SupplierController.getAllSuppliers));

// Route lấy thông tin chi tiết nhà cung cấp theo ID
router.get("/:id", asyncHandle(SupplierController.getSupplierById));

// Route cập nhật thông tin nhà cung cấp
router.put("/update/:id", asyncHandle(SupplierController.updateSupplier));

// Route xóa nhà cung cấp
router.delete("/delete/:id", asyncHandle(SupplierController.deleteSupplier));

// API nhập hàng
router.post("/restock", SupplierController.restock);


module.exports = router;
