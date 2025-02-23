"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Brand = require("../models/brand.model");

class BrandService {
  // Tạo thương hiệu mới
  static async createBrand(payload) {
    if (!payload.brand_name || !payload.brand_thumb || !payload.brand_banner_image) {
      throw new BadRequestError("Thiếu thông tin bắt buộc!");
    }
    return await Brand.create(payload);
  }

  // Lấy danh sách tất cả thương hiệu
  static async getAllBrands() {
    return await Brand.find();
  }

  // Lấy thương hiệu theo ID
  static async getBrandById(id) {
    const brand = await Brand.findById(id);
    if (!brand) throw new NotFoundError("Thương hiệu không tồn tại!");
    return brand;
  }

  // Cập nhật thương hiệu theo ID
  static async updateBrand(id, payload) {
    const updatedBrand = await Brand.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedBrand) throw new NotFoundError("Thương hiệu không tồn tại!");
    return updatedBrand;
  }

  // Xóa thương hiệu theo ID
  static async deleteBrand(id) {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new NotFoundError("Thương hiệu không tồn tại!");
    return brand;
  }

  // 🔹 Tìm kiếm thương hiệu theo tên
  static async searchBrandByName(name) {
    return await Brand.find({ brand_name: { $regex: name, $options: "i" } });
  }
}

module.exports = BrandService;
