"use strict";

const ProductService = require("../services/product.service");

class ProductController {
  // Tạo sản phẩm mới với số lượng tồn kho
  static async createProduct(req, res, next) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      next(error);
    }
  }

  // Lấy sản phẩm theo ID
  static async getProductById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật sản phẩm
  static async updateProduct(req, res, next) {
    try {
      const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  // Xóa sản phẩm
  static async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: "Sản phẩm đã được xóa", data: deletedProduct });
    } catch (error) {
      next(error);
    }
  }

  // Tìm kiếm sản phẩm
  static async getListSearchProduct(req, res, next) {
    try {
      const products = await ProductService.searchProductsByUser(req.query);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tất cả sản phẩm
  static async getAllProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  // Các chức năng khác (featured, flash sale, sản phẩm mới, v.v.)
  static async getFeaturedProducts(req, res, next) {
    try {
      const products = await ProductService.getFeaturedProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getFlashSaleProducts(req, res, next) {
    try {
      const products = await ProductService.getFlashSaleProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getNewProducts(req, res, next) {
    try {
      const products = await ProductService.getNewProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getSimilarProducts(req, res, next) {
    try {
      const products = await ProductService.getSimilarProductsByCategory(req.params.id);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
