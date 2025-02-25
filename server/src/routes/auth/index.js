const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const asyncHandle = require("../../helper/asyncHandle");
const authentication = require("../../middlewares/authentication");

const router = express.Router();

// Xác thực email khi đăng ký
router.post("/email/send-verification", asyncHandle(AuthController.sendVerificationEmail));
router.put("/email/verify", asyncHandle(AuthController.confirmVerificationEmail));
// Đăng ký & đăng nhập
router.post("/signup", asyncHandle(AuthController.userSignup));
router.post("/login", asyncHandle(AuthController.userLogin));
router.post("/refreshToken", asyncHandle(AuthController.refreshToken));
// Chức năng quên mật khẩu
router.post("/email/send-forgot-password", asyncHandle(AuthController.forgotPassword)); // Gửi mã
router.post("/verify-reset-password", asyncHandle(AuthController.verifyResetCode)); // Xác nhận mã
router.post("/reset-password", asyncHandle(AuthController.resetPassword)); // Đổi mật khẩu

// Yêu cầu authentication mới có thể logout
router.use(authentication);
router.post("/logout", asyncHandle(AuthController.userLogout));
// Đổi mật khẩu (API yêu cầu người dùng đã đăng nhập)
router.put("/change-password", asyncHandle(AuthController.changePassword));


module.exports = router;
