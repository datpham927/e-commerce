"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Supplier = require("../models/supplier.model");

class SupplierService {
  // Thêm nhà cung cấp mới
  static async createSupplier({ supplier_name, supplier_contact, supplier_email, supplier_address, supplier_phone, supplier_description }) {
    if (!supplier_name || !supplier_contact || !supplier_email || !supplier_phone) {
      throw new BadRequestError("Thông tin không hợp lệ.");
    }

    const newSupplier = await Supplier.create({
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      supplier_phone,
      supplier_description,
    });

    return newSupplier;
  }

  // Lấy danh sách tất cả nhà cung cấp
  static async getAllSuppliers() {
    const suppliers = await Supplier.find().lean();
    return suppliers;
  }

  // Lấy thông tin chi tiết nhà cung cấp theo ID
  static async getSupplierById(supplierId) {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return supplier;
  }

  // Cập nhật thông tin nhà cung cấp
  static async updateSupplier(supplierId, updateData) {
    const supplier = await Supplier.findByIdAndUpdate(supplierId, updateData, { new: true, runValidators: true });
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return supplier;
  }

  // Xóa nhà cung cấp
  static async deleteSupplier(supplierId) {
    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return { message: "Nhà cung cấp đã được xóa thành công." };
  }
}

module.exports = SupplierService;
