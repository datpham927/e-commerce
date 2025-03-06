"use strict";
const { BadRequestError } = require("../core/error.response");
const FavoriteProduct = require("../models/favoriteProduct.model");

class FavoriteProductService {
    // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
    static async toggleFavoriteProduct(userId, productId) {
        if (!userId || !productId) {
            throw new BadRequestError("Thiếu thông tin người dùng hoặc sản phẩm");
        }
        // Tìm document của user
        let userFavorites = await FavoriteProduct.findOne({ fp_user_id: userId });
        if (userFavorites) {
            // Kiểm tra xem product đã có trong mảng chưa
            const productIndex = userFavorites.fp_product.indexOf(productId);
            if (productIndex > -1) {
                // Nếu đã tồn tại thì xóa khỏi mảng
                userFavorites.fp_product.splice(productIndex, 1);
                if (userFavorites.fp_product.length === 0) {
                    // Nếu mảng rỗng thì xóa luôn document
                    await FavoriteProduct.deleteOne({ fp_user_id: userId });
                } else {
                    await userFavorites.save();
                }
                return {
                    message: "Sản phẩm đã bị xóa khỏi danh sách yêu thích",
                };
            } else {
                // Nếu chưa tồn tại thì thêm vào mảng
                userFavorites.fp_product.push(productId);
                await userFavorites.save();
                return {
                    message: "Sản phẩm đã được thêm vào danh sách yêu thích",
                };
            }
        } else {
            // Nếu chưa có document thì tạo mới với mảng chứa productId
            const newFavorite = await FavoriteProduct.create({
                fp_user_id: userId,
                fp_product: [productId]
            });
            return {
                message: "Sản phẩm đã được thêm vào danh sách yêu thích",
            };
        }
    }

    // Lấy danh sách sản phẩm yêu thích của user (bao gồm thông tin chi tiết sản phẩm)
    static async getUserFavoriteProducts(userId) {
        if (!userId) {
            throw new BadRequestError("Thiếu thông tin người dùng");
        }

        const favorites = await FavoriteProduct.findOne({ fp_user_id: userId })
            .populate("fp_products")  // Populate toàn bộ mảng fp_product
            .lean();

        return favorites || { fp_user_id: userId, fp_product: [] }; // Trả về rỗng nếu không có
    }
}

module.exports = FavoriteProductService;