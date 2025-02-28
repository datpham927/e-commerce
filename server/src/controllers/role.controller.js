"use strict";

const RoleService = require("../services/role.service");

class RoleController {
  // Tạo vai trò mới
  static async createRole(req, res, next) {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json({ message: "Tạo vai trò thành công", role });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách vai trò (có phân trang)
  static async getAllRoles(req, res, next) {
    try {
      const { limit, page } = req.query;
      const roles = await RoleService.getAllRoles({ limit: Number(limit), page: Number(page) });
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }

  // Lấy vai trò theo ID
  static async getRoleById(req, res, next) {
    try {
      const role = await RoleService.getRoleById(req.params.id);
      res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật vai trò
  static async updateRole(req, res, next) {
    try {
      const updatedRole = await RoleService.updateRole(req.params.id, req.body);
      res.status(200).json({ message: "Cập nhật vai trò thành công", updatedRole });
    } catch (error) {
      next(error);
    }
  }

  // Xóa vai trò
  static async deleteRole(req, res, next) {
    try {
      await RoleService.deleteRole(req.params.id);
      res.status(200).json({ message: "Xóa vai trò thành công" });
    } catch (error) {
      next(error);
    }
  }

  // Lấy vai trò theo tên
  static async getRoleByName(req, res, next) {
    try {
      const { name } = req.query;
      const role = await RoleService.getRoleByName(name);
      res.json(role);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;
