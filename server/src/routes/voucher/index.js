const express = require('express');
const VoucherController = require('../../controllers/voucher.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');

const router = express.Router();

// --- Public routes ---
// Lấy danh sách tất cả voucher
router.get('/all', asyncHandle(VoucherController.getAllVouchers));
router.get('/redeem', asyncHandle(VoucherController.getAllRedeemVouchers));
router.get('/system', asyncHandle(VoucherController.getAllSystemVouchers));

// Áp dụng mã giảm giá (người dùng sử dụng)
router.post('/apply', asyncHandle(VoucherController.applyVoucher));
router.get('/search', asyncHandle(VoucherController.searchVoucherByName));

// ✅ Lấy danh sách voucher đang hoạt động dùng cho banner (client)
router.get('/active-banners', asyncHandle(VoucherController.getActiveBannerVouchers));
router.get('/:code', asyncHandle(VoucherController.getVoucherByCode));
// --- Admin routes ---
router.use(adminAuthentication); // Kiểm tra xem người dùng có phải admin không
router.use(restrictTo(PERMISSIONS.VOUCHER_MANAGE)); // Kiểm tra quyền quản lý voucher
// Tìm kiếm voucher theo tên (Admin)
// Thêm mới voucher (Admin)
router.post('/add', asyncHandle(VoucherController.createVoucher));

// Cập nhật voucher theo ID (Admin)
router.put('/:id/update', asyncHandle(VoucherController.updateVoucher));

// Xóa voucher theo ID (Admin)
router.delete('/:id/delete', asyncHandle(VoucherController.deleteVoucher));

module.exports = router;
