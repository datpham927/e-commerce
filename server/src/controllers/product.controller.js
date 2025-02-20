"use strict";

const ProductService = require("../services/product.service");

class ProductController {
    static async createProduct(req, res, next) {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: newProduct });
    }

    static async getAllProducts(req, res, next) {
        const { limit, page } = req.query;
        const products = await ProductService.getAllProducts({ limit: Number(limit), page: Number(page) });
        res.status(200).json({ success: true, data: products });
    }

    static async getProductById(req, res, next) {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    }

    static async updateProduct(req, res, next) {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedProduct });
    }

    static async deleteProduct(req, res, next) {
        const deletedProduct = await ProductService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: "Sản phẩm đã được xóa", data: deletedProduct });
    }
}

module.exports = ProductController;
