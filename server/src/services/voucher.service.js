"use strict";
const Voucher = require("../models/voucher.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");
const voucherModel = require("../models/voucher.model");

class VoucherService {
  // Tạo voucher mới
  static async createVoucher(payload) {
    // Kiểm tra các trường bắt buộc
    if (
      !payload.voucher_name ||
      !payload.voucher_description ||
      !payload.voucher_start_date ||
      !payload.voucher_end_date ||
      !payload.voucher_method ||
      !payload.voucher_value ||
      !payload.voucher_max_uses ||
      !payload.voucher_min_order_value ||
      !payload.voucher_code
    ) {
      throw new BadRequestError("Thiếu thông tin bắt buộc!");
    }
    // Kiểm tra mã voucher có bị trùng không
    const existingVoucher = await voucherModel.findOne({ voucher_code: payload.voucher_code });
    if (existingVoucher) {
      throw new BadRequestError("Voucher code đã tồn tại!");
    }

    // Kiểm tra định dạng ngày bắt đầu và ngày hết hạn
    const startDate = new Date(payload.voucher_start_date);
    const endDate = new Date(payload.voucher_end_date);
    if (startDate >= endDate) {
      throw new BadRequestError("Ngày hết hạn phải sau ngày bắt đầu!");
    }

    // Kiểm tra giá trị voucher hợp lệ (giá trị voucher và giá trị đơn hàng tối thiểu phải lớn hơn 0)
    if (payload.voucher_value <= 0) {
      throw new BadRequestError("Giá trị voucher phải lớn hơn 0!");
    }
    if (payload.voucher_min_order_value <= 0) {
      throw new BadRequestError("Giá trị đơn hàng tối thiểu phải lớn hơn 0!");
    }

    // Tạo voucher mới
    const voucher = await voucherModel.create(payload);

    return voucher;
  }

  // Lấy danh sách tất cả voucher
  static async getAllVouchers() {
    return await voucherModel.find();
  }
  // Lấy voucher theo ID
  static async getVoucherById(id) {
    const voucher = await voucherModel.findById(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }
  // Cập nhật voucher theo ID
  static async updateVoucher(id, payload) {
    const updatedVoucher = await voucherModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedVoucher) throw new NotFoundError("Voucher không tồn tại!");
    return updatedVoucher;
  }
  // Xóa voucher theo ID
  static async deleteVoucher(id) {
    const voucher = await voucherModel.findByIdAndDelete(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }
  // 🔹 Tìm kiếm voucher theo tên
  static async searchVoucherByName(name) {
    const vouchers = await voucherModel.find({
      voucher_name: { $regex: new RegExp(name, "i") } // "i" để không phân biệt hoa thường
    });
    if (!vouchers.length) throw new NotFoundError("Không tìm thấy voucher phù hợp!");
    return vouchers;
  }



}

module.exports = VoucherService;
