"use strict";

const { BadRequestRequestError, NotFoundError } = require("../core/error.response");
const Banner = require("../models/banner.model");

class BannerService {
    // Tạo banner mới
    static async createBanner(payload) {
        if (Object.keys(payload).length === 0) {
            throw new BadRequestRequestError("Vui lòng cung cấp dữ liệu banner");
        }
        return await Banner.create(payload);
    }

    // Lấy tất cả banner (hỗ trợ phân trang)
    static async getAllBanners({ limit = 10, page = 1 }) {
        const banners = await Banner.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        return banners;
    }

    // Lấy banner theo ID
    static async getBannerById(bannerId) {
        const banner = await Banner.findById(bannerId);
        if (!banner) throw new NotFoundError("Không tìm thấy banner");
        return banner;
    }

    // Cập nhật banner
    static async updateBanner(bannerId, updateData) {
        const updatedBanner = await Banner.findByIdAndUpdate(bannerId, updateData, { new: true });
        if (!updatedBanner) throw new NotFoundError("Không tìm thấy banner để cập nhật");
        return updatedBanner;
    }

    // Xóa banner
    static async deleteBanner(bannerId) {
        const deletedBanner = await Banner.findByIdAndDelete(bannerId);
        if (!deletedBanner) throw new NotFoundError("Không tìm thấy banner để xóa");
        return deletedBanner;
    }
}

module.exports = BannerService;
