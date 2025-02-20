"use strict";

const BannerService = require("../services/banner.service");

class BannerController {
    static async createBanner(req, res, next) {
        const newBanner = await BannerService.createBanner(req.body);
        res.status(201).json({ success: true, data: newBanner });
    }

    static async getAllBanners(req, res, next) {
        const { limit, page } = req.query;
        const banners = await BannerService.getAllBanners({ limit: Number(limit), page: Number(page) });
        res.status(200).json({ success: true, data: banners });
    }

    static async getBannerById(req, res, next) {
        const banner = await BannerService.getBannerById(req.params.id);
        res.status(200).json({ success: true, data: banner });
    }

    static async updateBanner(req, res, next) {
        const updatedBanner = await BannerService.updateBanner(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedBanner });
    }

    static async deleteBanner(req, res, next) {
        const deletedBanner = await BannerService.deleteBanner(req.params.id);
        res.status(200).json({ success: true, message: "Banner đã được xóa", data: deletedBanner });
    }
}

module.exports = BannerController;
