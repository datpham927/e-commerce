'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const productModel = require('../models/product.model');
const PurchasedModel = require('../models/Purchased.model');
const Review = require('../models/reviews.model');
const userModel = require('../models/user.model');

class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating = 0, review_comment, review_images } = payload;
        if (!userId || !review_productId || !review_comment) {
            throw new RequestError('Thiếu thông tin để tạo đánh giá');
        }
        const hasPurchased = await PurchasedModel.findOne({
            pc_userId: userId,
            pc_productId: review_productId,
        });

        if (!hasPurchased && review_rating > 0) {
            throw new RequestError('Chỉ người đã mua sản phẩm mới được đánh giá sao');
        }
        if (hasPurchased) {
            hasPurchased.pc_isReviewed = true;
            await hasPurchased.save();
        }

        if (review_rating > 0) {
            // Tìm tất cả review của sản phẩm và lấy trường review_rating
            const foundReviews = await Review.find({ review_productId }).select('review_rating');
            // Tính trung bình review_rating
            let productRatings = 0;
            const totalRating = foundReviews.reduce((sum, review) => sum + review.review_rating, 0);
            productRatings = totalRating / foundReviews.length;
            // Cập nhật product_ratings trong document sản phẩm
            await productModel.findByIdAndUpdate(
                review_productId,
                {
                    product_ratings: productRatings > 0 ? productRatings : 4.5,
                },
                { new: true }, // Trả về document đã cập nhật
            );
        }

        const newReview = await Review.create({
            review_user: userId,
            review_productId,
            review_rating: hasPurchased ? review_rating : 0,
            review_comment,
            review_images,
            isApproved: review_rating > 0 ? true : false,
        });
        await userModel.findByIdAndUpdate(userId, {
            $inc: { user_reward_points: 5000 },
        });
        return newReview;
    }

    // ✏️ Cập nhật đánh giá
    static async updateReview(payload) {
        const { userId, reviewId, review_productId, review_comment, review_images } = payload;

        if (!userId || !reviewId || !review_productId || !review_comment) {
            throw new RequestError('Thiếu thông tin để cập nhật đánh giá');
        }
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                review_user: userId,
                review_productId,
                review_comment,
                review_images,
            },
            { new: true },
        );

        if (!updatedReview) {
            throw new NotFoundError('Không tìm thấy đánh giá để cập nhật');
        }

        return updatedReview;
    }

    // 📖 Lấy đánh giá đã duyệt cho sản phẩm (Public)
    static async getReviews({ productId, limit, page, rating }) {
        if (!(limit && page)) {
            return await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
        }
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const filter = { review_productId: productId, isApproved: true };
        if (rating) {
            filter.review_rating = rating;
        }
        const reviews = await Review.find(filter)
            .sort({ createdAt: -1 })
            .populate('review_user', '_id user_name user_avatar_url createdAt')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalReview = await Review.countDocuments(filter);
        return {
            totalPage: Math.ceil(totalReview / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalReview,
            reviews,
        };
    }

    // 📖 Lấy tất cả đánh giá (Admin)
    static async getAllReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find().populate('review_user', '_id user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments(),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: Number(page),
            totalReview,
            reviews,
        };
    }

    // ✅ Lấy đánh giá đã duyệt
    static async getApprovedReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find({ isApproved: true }).populate('review_user', 'user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments({ isApproved: true }),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: page,
            totalReview,
            reviews,
        };
    }

    // ❌ Lấy đánh giá chưa được duyệt
    static async getPendingReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find({ isApproved: false }).populate('review_user', 'user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments({ isApproved: false }),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: page,
            totalReview,
            reviews,
        };
    }

    // ✅ Duyệt đánh giá
    static async approveReview(reviewId) {
        if (!reviewId) throw new RequestError('Thiếu reviewId để duyệt đánh giá');
        // Duyệt đánh giá
        const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true }).lean(); // Chuyển về plain JS object
        if (!review) throw new NotFoundError('Không tìm thấy đánh giá');
        // Lấy sản phẩm liên quan
        const product = await productModel.findById(review.review_productId).lean();
        if (!product) throw new NotFoundError('Không tìm thấy sản phẩm');
        // Trả về kết quả
        return {
            ...review,
            review_product_slug: product.product_slug,
        };
    }

    static async deleteReview(reviewId) {
        if (!reviewId) throw new RequestError('Thiếu reviewId để xóa đánh giá');
        // Xóa đánh giá
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) throw new RequestError('Không tìm thấy đánh giá');
        // Lấy review_productId từ review đã xóa
        if (review.review_rating > 0) {
            const review_productId = review.review_productId;
            // Tìm tất cả review còn lại của sản phẩm
            const foundReviews = await Review.find({ review_productId }).select('review_rating');
            // Tính trung bình review_rating
            let productRatings = 0;
            const totalRating = foundReviews.reduce((sum, review) => sum + review.review_rating, 0);
            productRatings = Number((totalRating / foundReviews.length).toFixed(2));
            const updatedProduct = await productModel.findByIdAndUpdate(
                review_productId,
                {
                    product_ratings: productRatings > 0 ? productRatings : 4.5,
                },
                { new: true }, // Trả về document đã cập nhật
            );
        }

        return review;
    }
}

module.exports = ReviewService;
