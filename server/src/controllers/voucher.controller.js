"use strict";

const VoucherService = require("../services/voucher.service");

const VoucherController = {
  // Thêm voucher mới
  createVoucher: async (req, res) => {
    const voucher = await VoucherService.createVoucher(req.body);
    res.status(201).json({ success: true, data: voucher });
  },

  // Lấy danh sách tất cả voucher
  getAllVouchers: async (req, res) => {
    const vouchers = await VoucherService.getAllVouchers();
    res.status(200).json({ success: true, data: vouchers });
  },

  // Lấy chi tiết voucher theo ID
  getVoucherById: async (req, res) => {
    const voucher = await VoucherService.getVoucherById(req.params.id);
    res.status(200).json({ success: true, data: voucher });
  },

  // Cập nhật voucher theo ID
  updateVoucher: async (req, res) => {
    const updatedVoucher = await VoucherService.updateVoucher(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedVoucher });
  },

  // Xóa voucher theo ID
  deleteVoucher: async (req, res) => {
    await VoucherService.deleteVoucher(req.params.id);
    res.status(200).json({ success: true, message: "Xóa voucher thành công!" });
  },

  //tìm theo tên
  searchVoucherByName: async (req, res) => {
    const vouchers = await VoucherService.searchVoucherByName(req.query.name);
    res.status(200).json({ success: true, data: vouchers });
  },

};

module.exports = VoucherController;
