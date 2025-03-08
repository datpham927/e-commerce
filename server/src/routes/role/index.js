"use strict";

const express = require("express");
const RoleController = require("../../controllers/role.controller");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

// Lấy danh sách vai trò (có phân trang)
router.get("/all", RoleController.getAllRoles);

// Lấy vai trò theo ID
router.get("/:id/search", RoleController.getRoleById);

// Lấy vai trò theo tên
router.get("/search", RoleController.getRoleByName);

// =============== ADMIN ===============
router.use(authentication);
router.use(restrictTo(PERMISSIONS.ROLE_MANAGE));

// Tạo vai trò mới
router.post("/add", RoleController.createRole);

// Cập nhật vai trò
router.put("/:id/update", RoleController.updateRole);

// Xóa vai trò
router.delete("/:id/delete", RoleController.deleteRole);

module.exports = router;
