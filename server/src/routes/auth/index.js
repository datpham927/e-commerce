const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const asyncHandle = require("../../helper/asyncHandle");
const authentication = require("../../middlewares/authentication");

const router = express.Router();

router.post("/email/send-verification", asyncHandle(AuthController.sendVerificationEmail));
router.put("/email/verify", asyncHandle(AuthController.confirmVerificationEmail));
router.post("/signup", asyncHandle(AuthController.userSignup));
router.post("/login", asyncHandle(AuthController.userLogin));
router.post("/refreshToken", asyncHandle(AuthController.refreshToken))
router.use(authentication)
router.post("/logout", asyncHandle(AuthController.userLogout));

module.exports = router;
