"use strict";

const ProductService = require("../services/product.service");

class ProductController {
    static async createProduct(req, res, next) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            next(error);
        }
    }

    static async getAllProducts(req, res, next) {
        try {
            const { limit, page } = req.query;
            const products = await ProductService.getAllProducts({ limit: Number(limit), page: Number(page) });
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    static async getProductById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedProduct });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ success: true, message: "Sản phẩm đã được xóa", data: deletedProduct });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
