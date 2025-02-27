"use strict";

const FavoriteProductService = require("../services/favorite.service");

class FavoriteProductController {
    // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
    static async toggleFavoriteProduct(req, res, next) {
        try {
            const userId = req.user._id; // Lấy từ middleware auth
            const { productId } = req.body;

            const result = await FavoriteProductService.toggleFavoriteProduct(userId, productId);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách yêu thích của user
    static async getUserFavoriteProducts(req, res, next) {
        try {
            const userId = req.user._id;
            const favorites = await FavoriteProductService.getUserFavoriteProducts(userId);
            res.status(200).json({ success: true, data: favorites });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FavoriteProductController;
