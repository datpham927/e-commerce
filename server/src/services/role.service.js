"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Role = require("../models/role.model");

class RoleService {
  // Tạo vai trò mới
  static async createRole(payload) {
    if (!payload || !payload.name || !payload.permissions) {
      throw new BadRequestError("Vui lòng cung cấp đầy đủ thông tin vai trò");
    }
    return await Role.create(payload);
  }

  // Lấy danh sách tất cả vai trò
  static async getAllRoles({ limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const roles = await Role.find().skip(skip).limit(limit);
    const totalRoles = await Role.countDocuments();

    return {
      roles,
      totalPages: Math.ceil(totalRoles / limit),
      currentPage: page,
    };
  }

  // Lấy vai trò theo ID
  static async getRoleById(roleId) {
    const role = await Role.findById(roleId);
    if (!role) throw new NotFoundError("Không tìm thấy vai trò");
    return role;
  }

  // Cập nhật vai trò
  static async updateRole(roleId, updateData) {
    const updatedRole = await Role.findByIdAndUpdate(roleId, updateData, { new: true });
    if (!updatedRole) throw new NotFoundError("Không tìm thấy vai trò để cập nhật");
    return updatedRole;
  }

  // Xóa vai trò
  static async deleteRole(roleId) {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) throw new NotFoundError("Không tìm thấy vai trò để xóa");
    return deletedRole;
  }
}

module.exports = RoleService;
