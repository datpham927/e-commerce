"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new mongoose.Schema(
  {
    cart_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart_products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, cartSchema, COLLECTION_NAME);
