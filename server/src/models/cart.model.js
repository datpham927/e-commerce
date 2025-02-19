"use strict"
const mongoose = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = "cart"
const COLLECTION_NAME = "carts"

const cartSchema = new mongoose.Schema({
    cart_userId: { type: string, require: true },
    cart_products: { type: Array, require: true, default: [] },
    //  {
    //     productId,
    //     quantity,
    //     name
    //     price
    //  }
    cart_count_product: { type: Number, default: 0 }, // số lượng sản phẩm trong giỏ hàng
}, {
    timestamp: true,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);