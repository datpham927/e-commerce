"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Order Schema
 */
const orderSchema = new Schema(
  {
    order_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order_products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Lưu giá cho từng sản phẩm
      },
    ],
    voucherCode: { type: Schema.Types.ObjectId, ref: "Voucher" },
    order_is_paid: { type: Boolean, required: true, default: false },
    order_total_price: { type: Number, required: true, default: 0, min: 0 },
    order_payment_method: {
      type: String,
      required: true,
      enum: ["cash", "credit_card", "paypal", "bank_transfer"],
    },
    order_status: {
      type: String,
      enum: ["pending", "confirm", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    order_shipping_address: {
      fullName: { type: String, required: true },
      detailAddress: { type: String, required: true },
      village: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    order_shipping_company: {
      company: { type: Schema.Types.ObjectId, ref: "ShippingCompany", required: true },
      shipping_price: { type: Number, required: true, min: 0 }, 
      date_shipping: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
