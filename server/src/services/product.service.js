"use strict";

const { NotFoundError } = require("../core/error.response");
const Product = require("../models/product.model");
const cosineSimilarity = require("../utils/search-image/cosineSimilarity");
const downloadImage = require("../utils/search-image/downloadImage");
const extractFeatures = require("../utils/search-image/extractFeatures");
const path = require("path");
const tf = require("@tensorflow/tfjs"); // Sử dụng phiên bản Web
const fs = require("fs").promises;

class ProductService {
  // Tạo sản phẩm mới với số lượng tồn kho
  static async createProduct(payload) {
    if (Object.keys(payload).length === 0) {
      throw new Error("Vui lòng cung cấp dữ liệu sản phẩm");
    }

    // Tạo sản phẩm mới
    const newProduct = await Product.create(payload);

    return newProduct;
  }

  // Lấy sản phẩm theo ID
  static async getProductById(productId) {
    const product = await Product.findById(productId).lean();
    if (!product) throw new NotFoundError("Không tìm thấy sản phẩm");
    return product;
  }

  // Cập nhật sản phẩm (bao gồm cập nhật số lượng tồn kho nếu có)
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

  // Tìm kiếm sản phẩm theo  
  static async searchProductsByUser({ keySearch, limit, page }) {
    const regexSearch = new RegExp(keySearch);
    const limitNum = parseInt(limit, 10); // Mặc định limit = 10
    const pageNum = parseInt(page, 10); // Mặc định page = 0
    const skipNum = pageNum * limitNum;
    const products = await Product.find({ $text: { $search: regexSearch } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount product_stock")
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    const totalProducts = await Product.countDocuments({ $text: { $search: regexSearch } });
    return {
      totalPage: Math.ceil(totalProducts / limitNum) - 1, // Tổng số trang (0-based)
      currentPage: pageNum,
      totalProducts,
      products,
    }; 
  }

  // Lấy tất cả sản phẩm (với các filter)
  static async getAllProducts(query = {}) {
    const { limit, page, ...searchConditions } = query;
    const limitNum = parseInt(limit, 10) || 10;
    const pageNum = parseInt(page, 10) || 0;
    const skipNum = pageNum * limitNum;

    const searchFilter = JSON.parse(
      JSON.stringify(searchConditions).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    ); 
    const products = await Product.find(searchFilter, { product_isPublished: true })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount product_stock")
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    const totalProducts = await Product.countDocuments(searchFilter);

    return {
      totalPage: Math.ceil(totalProducts / limitNum) - 1,
      currentPage: pageNum,
      totalProducts,
      products
    };
  }

  // Các chức năng khác (giảm giá, sản phẩm nổi bật, sản phẩm mới, v.v.)
  static async getFeaturedProducts() {
    return await Product.find({ product_isPublished: true })
      .sort({ sold_count: -1, rating: -1 })
      .select("_id product_thumb product_name product_slug")
      .limit(8).lean();
  }

  static async getFlashSaleProducts() {
    return await Product.find({
      product_discount: { $gte: 40 }
    })
      .select("_id product_thumb product_name product_slug product_discount")
      .sort({ product_discount: -1 })
      .lean();
  }

  static async getNewProducts() {
    return await Product.find({
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getSimilarProductsByCategory(id) {
    const currentProduct = await Product.findById(id);
    if (!currentProduct) throw new NotFoundError("Sản phẩm không tồn tại");

    return await Product.find({
      _id: { $ne: id },
      product_category_id: currentProduct.product_category_id
    })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")
      .sort({ sold_count: -1 })
      .limit(10)
      .lean();
  }

  static async getProductSuggestions(keySearch) {
    const regexSearch = new RegExp(keySearch)
    // full test search
    const products = await Product.find({ $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }, { product_isPublished: true })
      // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết 
      .sort({ score: { $meta: "textScore" } })
      .select("_id product_name product_slug")
      .limit(8)
      .lean();

    return { products };
  }

  static async searchProductByImage(imageUrl) {
    if (!imageUrl) throw new NotFoundError("Vui lòng cung cấp URL ảnh!");
    const tempPath = path.join(__dirname, "temp_search.png");
    if (!(await downloadImage(imageUrl, tempPath))) throw new BadRequestError("Không thể tải ảnh!");

    const searchFeatures = await extractFeatures(tempPath);
    if (!searchFeatures || searchFeatures.length === 0) {
      throw new BadRequestError("Không thể trích xuất đặc trưng từ ảnh!");
    }

    const productFeatures = await Product.find();
    const results = await Promise.all(
      productFeatures.map(async (product) => {
        if (!product.product_image_features || product.product_image_features.length === 0) {
          console.warn(`Skipping product ${product.image_url} due to empty features`);
          return { url: product.image_url, similarity: 0 };
        }

        const productTensor = tf.tensor1d(product.product_image_features);
        const similarity = cosineSimilarity(searchFeatures, productTensor);
        return {
          url: product.product_image_url,
          similarity: similarity  // Extract scalar value
        };
      })
    );

    const sortedResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    console.log(sortedResults);
    await fs.unlink(tempPath).catch(() => { });
    return sortedResults; // Fixed: return sortedResults instead of results
  }

}

module.exports = ProductService;
