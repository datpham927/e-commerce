"use strict";

const express = require("express");
const VoucherController = require("../../controllers/voucher.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

// Tìm voucher theo tên
router.get("/search", asyncHandle(VoucherController.searchVoucherByName));

// Thêm mới voucher
router.post("/add", asyncHandle(VoucherController.createVoucher));

// Lấy danh sách tất cả voucher
router.get("/all", asyncHandle(VoucherController.getAllVouchers));

// Lấy chi tiết voucher theo ID
router.get("/:id", asyncHandle(VoucherController.getVoucherById));

// Cập nhật voucher theo ID
router.put("/:id", asyncHandle(VoucherController.updateVoucher));

// Xóa voucher theo ID
router.delete("/:id", asyncHandle(VoucherController.deleteVoucher));

module.exports = router;
