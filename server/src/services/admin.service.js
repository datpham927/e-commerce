'use strict';

const { RequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/admin.model');

class AdminService {
    static async addAdmin(payload) {
        const { admin_name, admin_email, admin_password, admin_mobile, admin_type } = payload;
        if (!(admin_name || admin_email || admin_password || admin_mobile || admin_type)) {
            throw new RequestError('Thiếu thông tin bắt buộc!');
        }
        const existingAdmin = await AdminModel.findOne({ admin_email });
        if (existingAdmin) throw new RequestError('Email đã tồn tại!');
        const existingMobile = await AdminModel.findOne({ admin_mobile });
        if (existingMobile) throw new RequestError('Số điện thoại đã tồn tại!');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin_password, salt);
        const newAdmin = new AdminModel({
            ...payload,
            admin_password: hashedPassword,
        });

        return await newAdmin.save();
    }

    static async updateAdmin(uid, payload) {
        const { admin_email, admin_password, admin_mobile, ...dataAdmin } = payload;
        const admin = await AdminModel.findById(uid);
        if (!admin) throw new RequestError('Người dùng không tồn tại!', 404);
        if (admin_mobile && admin_mobile !== admin.admin_mobile) {
            const existingMobile = await AdminModel.findOne({ admin_mobile });
            if (existingMobile) throw new RequestError('Số điện thoại đã tồn tại!');
            dataAdmin.admin_mobile = admin_mobile;
        }
        if (admin_password) {
            const salt = await bcrypt.genSalt(10);
            dataAdmin.admin_password = await bcrypt.hash(admin_password, salt);
        }
        return await AdminModel.findByIdAndUpdate(uid, dataAdmin, {
            new: true,
            runValidators: true,
        });
    }

    static async deleteAdmin(uid) {
        const admin = await AdminModel.findByIdAndDelete(uid);
        if (!admin) throw new RequestError('Người dùng không tồn tại!', 404);

        return {
            _id: admin._id,
            admin_name: admin.admin_name,
            admin_email: admin.admin_email,
        };
    }

    static async getAllAdmins({ admin_id, limit, page }) {
        const limitNum = parseInt(limit, 10) || 10; // Default limit = 10 if invalid
        const pageNum = parseInt(page, 10) || 0; // Default page = 0 if invalid
        const skipNum = pageNum * limitNum;

        const admins = await AdminModel.find({ _id: { $ne: admin_id } })
            .select('-admin_password -__v') // Exclude admin_password and __v fields
            .populate('admin_roles', 'role_name') // Populate role_name from Role model
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .skip(skipNum) // Skip records based on page
            .limit(limitNum) // Limit the number of records returned
            .lean(); // Convert to plain JavaScript object

        // Transform admins to include roles (role names) and keep admin_roles as IDs
        const transformedAdmins = admins.map((admin) => ({
            ...admin,
            roles: admin.admin_roles.map((role) => role.role_name), // Extract role names
            admin_roles: admin.admin_roles.map((role) => role._id), // Keep only role IDs
        }));
        const totalAdmin = await AdminModel.countDocuments(); // Count total admins
        return {
            totalPage: Math.ceil(totalAdmin / limitNum) || 0, // Total pages (0-based)
            currentPage: pageNum, // Current page
            totalAdmin, // Total number of admins
            admins: transformedAdmins, // List of admins with roles and role IDs
        };
    }
    static async getProfile(adminId) {
        const admin = await AdminModel.findById(adminId)
            .select('-admin_password') // không lấy password
            .populate({
                path: 'admin_roles',
                select: 'role_name role_permissions',
            });

        if (!admin) return null;
        // Gộp toàn bộ quyền từ các role
        const allPermissions = admin.admin_roles.flatMap((role) => role.role_permissions);
        // Xoá trùng
        const uniquePermissions = [...new Set(allPermissions)];
        // Convert admin sang object JS thường
        const adminObj = admin.toObject();
        // Gắn thêm danh sách permission
        adminObj.permissions = uniquePermissions;
        delete adminObj.admin_roles;
        return adminObj;
    }

    static async updateProfile(uid, payload) {
        const { admin_password, ...updateData } = payload; // Không cho phép cập nhật mật khẩu

        // Tìm admin theo ID
        const admin = await AdminModel.findById(uid); // ✅ Sửa lại `AdminModel`
        if (!admin) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (updateData.admin_mobile && updateData.admin_mobile !== admin.admin_mobile) {
            const existingMobile = await AdminModel.findOne({ admin_mobile: updateData.admin_mobile }); // ✅ Sửa lại `AdminModel`
            if (existingMobile) {
                throw new RequestError('Số điện thoại đã tồn tại!');
            }
        }

        // Cập nhật thông tin
        const updatedAdmin = await AdminModel.findByIdAndUpdate(uid, updateData, {
            // ✅ Sửa lại `AdminModel`
            new: true,
            runValidators: true,
        });

        return updatedAdmin;
    }

    static async searchAdminsByNameOrEmail(keyword) {
        if (!keyword || typeof keyword !== 'string') return [];

        const regex = new RegExp(keyword.trim(), 'i');
        const results = await AdminModel.find({
            $or: [{ admin_mobile: regex }, { admin_name: regex }, { admin_email: regex }],
        })
            .select('-admin_password -__v')
            .sort({ createdAt: -1 })
            .lean();

        return results;
    }
}

module.exports = AdminService;
