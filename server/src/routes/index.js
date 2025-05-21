const express = require('express');
const router = express.Router();

// ------- auth ----------
router.use('/v1/api/auth', require('./auth/user'));
router.use('/v1/api/admin/auth', require('./auth/admin'));

// ===============================
router.use('/v1/api/user', require('./user/index'));
router.use('/v1/api/admin', require('./admin/index'));
router.use('/v1/api/category', require('./category/index'));
router.use('/v1/api/product', require('./product/index'));
router.use('/v1/api/brand', require('./brand/index'));
router.use('/v1/api/banner', require('./banner/index'));
router.use('/v1/api/cart', require('./cart/index'));
router.use('/v1/api/shippingCompany', require('./shippingCompany/index'));
router.use('/v1/api/voucher', require('./voucher/index'));
router.use('/v1/api/user-voucher', require('./userVoucher/index'));
router.use('/v1/api/favorite', require('./favoriteProduct/index'));
router.use('/v1/api/notification', require('./notification/index'));
router.use('/v1/api/supplier', require('./supplier/index'));
router.use('/v1/api/role', require('./role/index'));
router.use('/v1/api/order', require('./order/index'));
router.use('/v1/api/review', require('./review/index'));
router.use('/v1/api/dashboard', require('./dashboard/index'));
router.use('/v1/api/purchased', require('./purchased/index'));
router.use('/v1/api/conversation', require('./conversation/index'));
router.use('/v1/api/message', require('./message/index'));
router.use('/v1/api/chatbot', require('./chatbotPrompt/index'));


module.exports = router;
