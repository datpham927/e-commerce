"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Product = require("../models/product.model");

class ProductService {
  // Tạo sản phẩm mới
  static async createProduct(payload) {
    if (Object.keys(payload).length === 0) {
      throw new BadRequestError("Vui lòng cung cấp dữ liệu sản phẩm");
    }
    return await Product.create(payload);
  }
  // Lấy sản phẩm theo ID
  static async getProductById(productId) {
    const product = await Product.findById(productId).lean();
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
  static searchProductsByUser = async ({ keySearch, limit, page }) => {
    //RegExp Biểu thức chính quy được sử dụng để tìm kiếm và so khớp các chuỗi dựa trên một mẫu cụ thể.
    const regexSearch = new RegExp(keySearch)
    // full test search
    const limitNum = parseInt(limit, 10); // Mặc định limit = 10
    const pageNum = parseInt(page, 10); // Mặc định page = 0
    const skipNum = pageNum * limitNum;
    const products = await productModel.find({ $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }, { product_isPublished: true })
      // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết quả
      .sort({ score: { $meta: "textScore" } })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")
      .skip(skipNum)
      .limit(limitNum).lean()
    const totalProducts = await Product.countDocuments(searchFilter);
    // 7. Trả về kết quả
    return {
      totalPage: Math.ceil(totalProducts / limitNum) - 1, // Tổng số trang (0-based)
      currentPage: pageNum,
      totalProducts,
      products: products,
    };
  }

  static getAllProducts = async (query = {}) => {
    // 1. Sao chép query và loại bỏ các trường không cần thiết
    const filter = { ...query };
    const { limit, sort, page, ...searchConditions } = filter;
    // 2. Chuyển đổi các toán tử so sánh (gte, gt, lte, lt)
    //'{"price":{"$gte":100,"$lte":500},"area":{"$gt":50,"$lt":100}}'
    const queryString = JSON.stringify(searchConditions).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const searchFilter = JSON.parse(queryString);


    // 4. Đếm tổng số sản phẩm
    // 5. Xử lý phân trang và giới hạn
    const limitNum = parseInt(limit, 10); // Mặc định limit = 10
    const pageNum = parseInt(page, 10); // Mặc định page = 0
    const skipNum = pageNum * limitNum;
    // 6. Tạo và thực thi truy vấn
    const products = await Product 
      .find(searchFilter, { product_isPublished: true })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")  
      .skip(skipNum)
      .limit(limitNum).lean()
    const totalProducts = await Product.countDocuments(searchFilter);
    // 7. Trả về kết quả
    return {
      totalPage: Math.ceil(totalProducts / limitNum) - 1, // Tổng số trang (0-based)
      currentPage: pageNum,
      totalProducts,
      products: products,
    };
  }

  static async getFeaturedProducts() {
    return await Product.find({ product_isPublished: true })
      .sort({ sold_count: -1, rating: -1 })
      .select("_id product_thumb product_name product_slug")
      .limit(8).lean();;
  }
  static async getFlashSaleProducts() {
    const products = await Product.find({
      product_discount: { $gte: 40 }, // Giảm giá từ 40% trở lên
    }, { product_isPublished: true })
      .select("_id product_thumb product_name product_slug product_discount")
      .sort({ product_discount: -1 }).lean();; // Giảm giá cao nhất lên trước
    return products
  }
  static async getNewProducts() {
    const products = await Product.find({
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } // Sản phẩm được tạo trong 30 ngày gần nhất
    }, { product_isPublished: true })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")
      .sort({ createdAt: -1 }).lean();; // Sắp xếp mới nhất lên trước
    return products
  }
  static async getSimilarProductsByCategory(id) {
    const currentProduct = await Product.findById(id);
    if (!currentProduct) { throw new NotFoundError("Sản phẩm không tồn tại"); }
    // Lọc các sản phẩm cùng danh mục (loại trừ sản phẩm hiện tại)
    const similarProducts = await Product.find({
      _id: { $ne: id }, // Không lấy sản phẩm hiện tại
      product_category_id: currentProduct.product_category_id // Cùng category
    }, { product_isPublished: true })
      .select("_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount")
      .sort({ sold_count: -1 }) // Sắp xếp theo số lượt bán nhiều nhất
      .limit(10).lean();  // Giới hạn số sản phẩm trả về
    return similarProducts
  }
  static async getProductSuggestions(keySearch) {
    const regexSearch = new RegExp(keySearch)
    // full test search
    const products = await productModel.find({ $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }, { product_isPublished: true })
      // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết quả
      .sort({ score: { $meta: "textScore" } })
      .select("_id product_name product_slug")
      .limit(8).lean()
    // 7. Trả về kết quả
    return {
      products: products,
    };

  }

}

module.exports = ProductService;
