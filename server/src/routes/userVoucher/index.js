"use strict";

const express = require("express");
const router = express.Router();
const UserVoucherController = require("../../controllers/userVoucher.controller");
const { authentication } = require("../../middlewares/authMiddleware");
const asyncHandle = require("../../helper/asyncHandle");


router.use(authentication);
// Lưu voucher cho user
router.post("/vouchers/save", asyncHandle(UserVoucherController.saveVoucherForUser));
// Đổi voucher bằng điểm
router.post("/vouchers/redeem", asyncHandle(UserVoucherController.redeemVoucher));
// Lấy danh sách voucher của user
router.get("/vouchers/user", asyncHandle(UserVoucherController.getVoucherByUser));

module.exports = router; 
