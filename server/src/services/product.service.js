"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Product = require("../models/product.models");

class ProductService {
    // Tạo sản phẩm mới
    static async createProduct(payload) {
        if (Object.keys(payload).length === 0) {
            throw new BadRequestError("Vui lòng cung cấp dữ liệu sản phẩm");
        }
        return await Product.create(payload);
    }

    // Lấy tất cả sản phẩm (hỗ trợ phân trang)
    static async getAllProducts({ limit = 10, page = 1 }) {
        const products = await Product.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        return products;
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
