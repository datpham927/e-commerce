const express = require("express");
const SupplierController = require("../../controllers/supplier.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication } = require("../../middlewares/authMiddleware");

const router = express.Router();


// Áp dụng middleware xác thực trước khi thực hiện các hành động quản lý nhà cung cấp
router.use(authentication);


router.post("/add", asyncHandle(SupplierController.createSupplier));

router.get("/all", asyncHandle(SupplierController.getAllSuppliers));

router.get("/:id/search", asyncHandle(SupplierController.getSupplierById));

router.put("/:id/update", asyncHandle(SupplierController.updateSupplier));

router.delete("/:id/delete", asyncHandle(SupplierController.deleteSupplier));


module.exports = router;
