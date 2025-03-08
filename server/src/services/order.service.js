"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Order = require("../models/order.model");
const productModel = require("../models/product.model");
const voucherModel = require("../models/voucher.model");
const { convertToObjectIdMongodb } = require("../utils");

class OrderService {
  static async createOrder(payload) {

    const { userId, order_shipping_company, order_shipping_address,
      order_payment_method, order_voucher_, order_products,
    } = payload
    // lấy ra giá của sản phẩm
    const products = await Promise.all(order_products.map(async (product) => {
      const foundProduct = await productModel.findById(convertToObjectIdMongodb(product.productId));
      if (foundProduct) {
        return {
          productId: foundProduct._id,
          price: foundProduct.product_price,
          quantity: product.quantity,
        }
      }
    }))
    // tính tổng tiền
    const totalPrice = products.reduce((acc, product) => {
      return acc + (product.quantity * product.price)
    }, 0);
    // 1/ nếu có voucher thì check hạn sử dụng và giá trị đơn hàng tối thiểu để áp dụng voucher
    // 2/ check mức giảm giá tối đa (nếu là percent) voucher_max_price
    if (order_voucherCode) {
      const voucher = voucherModel.fineById()
    }

    return totalPrice


    return payload
  }

}

module.exports = OrderService;
