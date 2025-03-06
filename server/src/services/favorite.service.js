"use strict";

const { BadRequestError } = require("../core/error.response");
const FavoriteProduct = require("../models/favoriteProduct.model");

class FavoriteProductService {
    // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
    static async toggleFavoriteProduct(userId, productId) {
        if (!userId || !productId) {
            throw new BadRequestError("Thiếu thông tin người dùng hoặc sản phẩm");
        }

        // Kiểm tra sản phẩm có trong danh sách yêu thích chưa
        const existingFavorite = await FavoriteProduct.findOne({ fp_user_id: userId, fp_product: productId });

        if (existingFavorite) {
            // Nếu đã tồn tại thì xóa (hủy yêu thích)
            await FavoriteProduct.findOneAndDelete({ fp_user_id: userId, fp_product: productId });
            return { message: "Sản phẩm đã bị xóa khỏi danh sách yêu thích", isFavorite: false };
        } else {
            // Nếu chưa tồn tại thì thêm vào danh sách yêu thích
            const newFavorite = await FavoriteProduct.create({ fp_user_id: userId, fp_product: productId });
            return { message: "Sản phẩm đã được thêm vào danh sách yêu thích", isFavorite: true, data: newFavorite };
        }
    }

    // Lấy danh sách sản phẩm yêu thích của user (bao gồm thông tin chi tiết sản phẩm)
    static async getUserFavoriteProducts(userId) {
        if (!userId) {
            throw new BadRequestError("Thiếu thông tin người dùng");
        }
        return await FavoriteProduct.find({ fp_user_id: userId }).populate("fp_products");
    }
}

module.exports = FavoriteProductService;
