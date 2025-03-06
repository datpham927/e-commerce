"use strict";

const { BadRequestError, NotFoundError, ConflictRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const voucherModel = require("../models/voucher.model");
const userVoucherModel = require("../models/userVoucher.model"); // Thêm đúng model

class userVoucherService {

  // Lưu voucher cho user
  static async saveVoucherForUser(userId, voucherId) {
    if (!userId || !voucherId) throw new BadRequestError("Thiếu thông tin")
    // Kiểm tra voucher có tồn tại và còn hạn không
    const voucher = await userVoucherModel.findOne({
      _id: voucherId, voucher_end_date: { $gte: new Date() }
    });
    if (!voucher) throw new NotFoundError("Voucher không tồn tại hoặc đã hết hạn")
    // Tìm danh sách voucher của user
    const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId });
    if (!userVouchers) {
      // Nếu chưa có danh sách voucher thì tạo mới
      await userVoucherModel.create({ vc_user_id: userId, vc_vouchers: [voucherId] });
    } else {
      // Kiểm tra voucher đã được lưu chưa
      if (userVouchers.vc_vouchers.includes(voucherId)) {
        throw new ConflictRequestError("Voucher đã được lưu trước đó");
      }
      // Thêm voucher vào danh sách
      userVouchers.vc_vouchers.push(voucherId);
      await userVouchers.save();
    }
    return { message: "Voucher đã được lưu thành công" };
  }

  // Controller để đổi voucher
  static async redeemVoucher(userId, voucherId) {
    if (!userId || !voucherId) throw new BadRequestError("Vui lòng cung cấp thông tin");
    const user = await userModel.findById(userId);
    const voucher = await voucherModel.findById(voucherId);
    if (!user) throw new NotFoundError("Không tìm thấy người dùng");
    if (!voucher) throw new NotFoundError("Không tìm thấy voucher");
    if (!voucher.voucher_is_active) throw new BadRequestError("Voucher này hiện không hoạt động");
    const currentDate = new Date();
    if (currentDate < voucher.voucher_start_date || currentDate > voucher.voucher_end_date) {
      throw new BadRequestError("Voucher đã hết hạn sử dụng");
    }
    // Kiểm tra xem người dùng đã sở hữu voucher chưa
    const existingVoucher = await userVoucherModel.findOne({
      vc_user_id: userId,
      vc_vouchers: voucherId
    });
    if (existingVoucher) throw new BadRequestError("Bạn đã sở hữu voucher này");
    // Kiểm tra giới hạn số lần sử dụng voucher
    const userVoucherCount = voucher.voucher_users_used.filter(
      userUsedId => userUsedId.toString() === userId.toString()
    ).length;
    if (userVoucherCount >= voucher.voucher_max_uses_per_user) {
      throw new BadRequestError("Bạn đã đạt giới hạn số lần sử dụng voucher này");
    }
    if (user.user_reward_points < voucher.voucher_required_points) {
      throw new BadRequestError(
        `Không đủ điểm để đổi voucher. Cần ${voucher.voucher_required_points} điểm`
      );
    }
    // Trừ điểm của người dùng
    user.user_reward_points -= voucher.voucher_required_points;
    // Lưu voucher mới vào danh sách của người dùng
    await userVoucherModel.findOneAndUpdate(
      { vc_user_id: userId },
      { $push: { vc_vouchers: voucherId } },
      { new: true, upsert: true }
    );
    await user.save();
    return {
      message: "Đổi voucher thành công"
    };
  }

  // Lấy danh sách voucher của user
  static async getVoucherByUser(userId) {
    if (!userId) throw new BadRequestError("Thiếu thông tin người dùng");

    const userVouchers = await userVoucherModel
      .findOne({ vc_user_id: userId })
      .populate("vc_vouchers");

    if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
      throw new NotFoundError("Người dùng chưa có voucher nào");
    }

    return userVouchers.vc_vouchers.map(voucher => ({
      voucherId: voucher._id,
      voucherName: voucher.voucher_name,
      voucherCode: voucher.voucher_code,
      voucherValue: voucher.voucher_value,
      voucherType: voucher.voucher_method,
      expirationDate: voucher.voucher_end_date
    }));
  }

  // Lấy danh sách voucher còn hạn của user
  static async getVouchersByUser(userId) {
    if (!userId) throw new BadRequestError("Thiếu thông tin người dùng");
    const userVouchers = await userVoucherModel
      .findOne({ vc_user_id: userId })
      .populate({
        path: "vc_vouchers",
        match: { voucher_end_date: { $gte: new Date() } }, // Chỉ lấy voucher còn hạn
      });

    if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
      throw new NotFoundError("Người dùng chưa có voucher nào còn hạn");
    }
    // Trả về danh sách voucher còn hạn
    return userVouchers.vc_vouchers
  }
}

module.exports = userVoucherService;
