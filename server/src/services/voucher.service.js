"use strict";

const Voucher = require("../models/voucher.model");
const { BadRequestRequestError, NotFoundError } = require("../core/error.response");

const VoucherService = {
  // Tạo voucher mới
  createVoucher: async (payload) => {
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
      throw new BadRequestRequestError("Thiếu thông tin bắt buộc!");
    }
    return await Voucher.create(payload);
  },

  // Lấy danh sách tất cả voucher
  getAllVouchers: async () => {
    return await Voucher.find();
  },

  // Lấy voucher theo ID
  getVoucherById: async (id) => {
    const voucher = await Voucher.findById(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  },

  // Cập nhật voucher theo ID
  updateVoucher: async (id, payload) => {
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedVoucher) throw new NotFoundError("Voucher không tồn tại!");
    return updatedVoucher;
  },

  // Xóa voucher theo ID
  deleteVoucher: async (id) => {
    const voucher = await Voucher.findByIdAndDelete(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  },

  //tìm theo tên
  searchVoucherByName: async (name) => {
    const vouchers = await Voucher.find({
      voucher_name: { $regex: new RegExp(name, "i") } // "i" để không phân biệt hoa thường
    });

    if (!vouchers.length) throw new NotFoundError("Không tìm thấy voucher phù hợp!");

    return vouchers;
  },
};

module.exports = VoucherService;
