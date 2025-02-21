const express = require("express");
const UserAuthController = require("../../controllers/auth/user.auth.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authenticationUser } = require("../../middlewares/authenticationUser");

const router = express.Router();

router.post("/email/send-verification", asyncHandle(UserAuthController.sendVerificationEmail));
router.put("/email/verify", asyncHandle(UserAuthController.confirmVerificationEmail));
router.post("/signup", asyncHandle(UserAuthController.userSignup));
router.post("/login", asyncHandle(UserAuthController.userLogin));
router.post("/refreshToken", asyncHandle(UserAuthController.refreshToken))
router.use(authenticationUser)
router.post("/logout", asyncHandle(UserAuthController.userLogout));

module.exports = router;
