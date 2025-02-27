const express = require("express");
const RoleController = require("../../controllers/role.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

// =============== admin =================
router.use(authentication);
router.use(restrictTo(PERMISSIONS.ROLE_MANAGE));

// Thêm vai trò mới
router.post("/add", asyncHandle(RoleController.createRole));
// Lấy tất cả vai trò (có phân trang)
router.get("/all", asyncHandle(RoleController.getAllRoles));
// Lấy vai trò theo ID
router.get("/:id/search", asyncHandle(RoleController.getRoleById));
// Cập nhật vai trò
router.put("/:id/update", asyncHandle(RoleController.updateRole));
// Xóa vai trò
router.delete("/:id/delete", asyncHandle(RoleController.deleteRole));

module.exports = router;
