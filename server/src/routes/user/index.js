const express = require("express");
const UserController = require("../../controllers/user.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware"); 
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

// ✅ Xác thực trước rồi mới kiểm tra quyền
router.use(authentication);
router.use(restrictTo(PERMISSIONS.USER_MANAGE));

router.get("/all", asyncHandle(UserController.getAllUsers));
router.post("/add", asyncHandle(UserController.addUser));
router.put("/:uid/update", asyncHandle(UserController.updateUser));
router.delete("/:uid/delete", asyncHandle(UserController.deleteUser));
router.put("/:uid/toggle-block", asyncHandle(UserController.toggleBlockUser));

module.exports = router;
