const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    review_rating: { type: Number, default: 0 },
    review_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    review_comment: { type: String, require: true },
    review_images: { type: Array, default: [] },
    review_likes: { type: Array, default: [] },
    review_productId: { type: String, require: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Reviews', reviewsSchema);
