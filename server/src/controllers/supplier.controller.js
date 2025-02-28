"use strict";

const SupplierService = require("../services/supplier.service");
const { BadRequestError } = require("../core/error.response");

class SupplierController {
  // Thêm nhà cung cấp mới
  static async createSupplier(req, res, next) {
    try {
      const supplier = await SupplierService.createSupplier(req.body);
      res.status(201).json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách nhà cung cấp
  static async getAllSuppliers(req, res, next) {
    try {
      const suppliers = await SupplierService.getAllSuppliers();
      res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
      next(error);
    }
  }

  // Lấy thông tin nhà cung cấp theo ID
  static async getSupplierById(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await SupplierService.getSupplierById(id);
      res.status(200).json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật thông tin nhà cung cấp
  static async updateSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await SupplierService.updateSupplier(id, req.body);
      res.status(200).json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  // Xóa nhà cung cấp
  static async deleteSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const response = await SupplierService.deleteSupplier(id);
      res.status(200).json({ success: true, message: response.message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SupplierController;
