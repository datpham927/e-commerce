"use strict";

const ProductService = require("../services/product.service");

class ProductController {
    static async createProduct(req, res, next) {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: newProduct });
    }
    static async getProductById(req, res, next) {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    }
    static async updateProduct(req, res) {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedProduct });
    }
    static async deleteProduct(req, res) {
        const deletedProduct = await ProductService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: "Sản phẩm đã được xóa", data: deletedProduct });
    }
    static async getListSearchProduct(req, res) {
        const { keySearch } = req.params
        res.status(200).json({
            success: true,
            data: await ProductService.searchProductsByUser(keySearch)
        });


    }
    static async getAllProducts(req, res) {
        const products = await ProductService.getAllProducts(req.query);
        res.status(200).json({ success: true, data: products });
    }
    // Sản phẩm nổi bật
    static async getFeaturedProducts(req, res) {
        res.status(200).json({
            success: true,
            data: await ProductService.getFeaturedProducts()
        });
    }
    // sản phẩm giảm giá sốc
    static async getFlashSaleProducts(req, res) {
        res.status(200).json({
            success: true,
            data: await ProductService.getFlashSaleProducts()
        });
    } // sản phẩm mới
    static async getNewProducts(req, res) {
        res.status(200).json({
            success: true,
            data: await ProductService.getNewProducts()
        });
    }
    // sản phẩm liên quan
    static async getSimilarProductsByCategory(req, res) {
        res.status(200).json({
            success: true,
            data: await ProductService.getSimilarProductsByCategory(req.params.id)
        });
    }
    // gợi ý sản phẩm khi search
    static async getProductSuggestions(req, res) {
        const keySearch = req.params
        res.status(200).json({
            success: true,
            data: await ProductService.getProductSuggestions(keySearch)
        });
    }

    // gợi ý sản phẩm khi search
    static async searchProductByImage(req, res) {
        const { imageUrl } = req.body
        res.status(200).json({
            success: true,
            data: await ProductService.searchProductByImage(imageUrl)
        });
    }
}

module.exports = ProductController;