"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Product = require("../models/product.model");
const Notification = require("../models/notification.model");

class ProductService {
    // Tạo sản phẩm mới
    static async createProduct(payload) {
        if (Object.keys(payload).length === 0) {
          throw new BadRequestError("Vui lòng cung cấp dữ liệu sản phẩm");
        }
    
        const product = await Product.create(payload);
    
        // Gửi thông báo đến tất cả người dùng
        await Notification.create({
          notification_user: "all", 
          notification_title: "🆕 Sản phẩm mới vừa ra mắt!",
          notification_subtitle: `Khám phá ngay: ${payload.product_name}`,
          notification_imageUrl: payload.product_thumb, 
          notification_link: `/products/${product._id}`,
          notification_isWatched: false,
        });
    
        return product;
      }

      // Thêm vào ProductService
static async getAllProducts({ limit = 10, page = 1 }) {
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments();

  return {
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
  };
}


    // Lấy sản phẩm theo ID
    static async getProductById(productId) {
        const product = await Product.findById(productId);
        if (!product) throw new NotFoundError("Không tìm thấy sản phẩm");
        return product;
    }

    // Cập nhật sản phẩm
    static async updateProduct(productId, updateData) {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) throw new NotFoundError("Không tìm thấy sản phẩm để cập nhật");
        return updatedProduct;
    }

    // Xóa sản phẩm
    static async deleteProduct(productId) {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) throw new NotFoundError("Không tìm thấy sản phẩm để xóa");
        return deletedProduct;
    }
    // Tìm kiếm sản phẩm theo tên
    static async searchProductsByName(name) {
        if (!name) throw new BadRequestError("Vui lòng nhập tên sản phẩm để tìm kiếm");
        const products = await Product.find({
        product_name: { $regex: name, $options: "i" } // Tìm kiếm không phân biệt hoa thường
        });
        if (products.length === 0) throw new NotFoundError("Không tìm thấy sản phẩm nào");
        return products;
    }
}

module.exports = ProductService;
