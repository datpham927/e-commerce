"use strict";

const express = require("express");
const router = express.Router();
const UserVoucherController = require("../../controllers/userVoucher.controller");
const { authentication } = require("../../middlewares/authMiddleware");


router.use(authentication);
// Lưu voucher cho user
router.post("/vouchers/save", UserVoucherController.saveVoucherForUser);
// Đổi voucher bằng điểm
router.post("/vouchers/redeem", UserVoucherController.redeemVoucher);
// Lấy danh sách voucher của user
router.get("/vouchers/user", UserVoucherController.getVoucherByUser);

module.exports = router;