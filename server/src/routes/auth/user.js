const express = require("express");
const UserAuthController = require("../../controllers/auth/user.auth.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authenticationUser } = require("../../middlewares/authenticationUser");

const router = express.Router();

// Xác thực email khi đăng ký
router.post("/email/send-verification", asyncHandle(UserAuthController.sendVerificationEmail));
router.put("/email/verify", asyncHandle(UserAuthController.confirmVerificationEmail));

// Đăng ký & đăng nhập
router.post("/signup", asyncHandle(UserAuthController.userSignup));
router.post("/login", asyncHandle(UserAuthController.userLogin));
router.post("/refreshToken", asyncHandle(UserAuthController.refreshToken));

// Chức năng quên mật khẩu
router.post("/email/send-forgot-password", asyncHandle(UserAuthController.forgotPassword)); // Gửi mã
router.post("/verify-reset-password", asyncHandle(UserAuthController.verifyResetCode)); // Xác nhận mã
router.post("/reset-password", asyncHandle(UserAuthController.resetPassword)); // Đổi mật khẩu

// Yêu cầu authentication mới có thể logout
router.use(authenticationUser);
router.post("/logout", asyncHandle(UserAuthController.userLogout));

module.exports = router;
