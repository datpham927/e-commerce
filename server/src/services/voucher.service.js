"use strict";

const Voucher = require("../models/voucher.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class VoucherService {
  // Tạo voucher mới
  static async createVoucher(payload) {
    if (
      !payload.voucher_name ||
      !payload.voucher_description ||
      !payload.voucher_code ||
      !payload.voucher_start_date ||
      !payload.voucher_end_date ||
      !payload.voucher_method ||
      !payload.voucher_value ||
      !payload.voucher_max_uses ||
      !payload.voucher_max_uses_per_user ||
      !payload.voucher_min_order_value
    ) {
      throw new BadRequestError("Thiếu thông tin bắt buộc!");
    }
    return await Voucher.create(payload);
  }

  // Lấy danh sách tất cả voucher
  static async getAllVouchers() {
    return await Voucher.find();
  }

  // Lấy voucher theo ID
  static async getVoucherById(id) {
    const voucher = await Voucher.findById(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }

  // Cập nhật voucher theo ID
  static async updateVoucher(id, payload) {
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedVoucher) throw new NotFoundError("Voucher không tồn tại!");
    return updatedVoucher;
  }

  // Xóa voucher theo ID
  static async deleteVoucher(id) {
    const voucher = await Voucher.findByIdAndDelete(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }

  // 🔹 Tìm kiếm voucher theo tên
  static async searchVoucherByName(name) {
    const vouchers = await Voucher.find({
      voucher_name: { $regex: new RegExp(name, "i") } // "i" để không phân biệt hoa thường
    });

    if (!vouchers.length) throw new NotFoundError("Không tìm thấy voucher phù hợp!");

    return vouchers;
  }
}

module.exports = VoucherService;
