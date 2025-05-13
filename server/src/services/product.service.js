'use strict';
const { NotFoundError, RequestError } = require('../core/error.response');
const Product = require('../models/product.model');
const cosineSimilarity = require('../utils/search-image/cosineSimilarity');
const downloadImage = require('../utils/search-image/downloadImage');
const extractFeatures = require('../utils/search-image/extractFeatures');
const path = require('path');
const tf = require('@tensorflow/tfjs'); // Sử dụng phiên bản Web
const generateRandomCode = require('../utils/generateRandomCode');
const productModel = require('../models/product.model');
const fs = require('fs').promises;

class ProductService {
    // Tạo sản phẩm mới với số lượng tồn kho
    static async createProduct(payload) {
        if (Object.keys(payload).length === 0) {
            throw new RequestError('Vui lòng cung cấp dữ liệu sản phẩm');
        }
        payload.product_code = generateRandomCode(10);
        // Xử lý ảnh chỉ nếu có product_thumb
        if (payload?.product_thumb) {
            const randomFileName = `temp_search_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.JPG`;
            const imgDir = path.join(__dirname, 'img');
            const tempPath = path.join(imgDir, randomFileName);
            try {
                // Đảm bảo folder tồn tại
                await fs.mkdir(imgDir, { recursive: true });
                // Tải ảnh và trích xuất đặc trưng
                await downloadImage(payload.product_thumb, tempPath);
                const searchFeatures = await extractFeatures(tempPath);
                payload.product_image_features = Array.from(searchFeatures.dataSync());
                // Giải phóng Tensor
                searchFeatures.dispose();
            } catch (err) {
                console.error('Lỗi xử lý ảnh:', err);
                // Tiếp tục thêm sản phẩm mà không có đặc trưng ảnh
                payload.product_image_features = [];
            } finally {
                // Xóa file tạm
                fs.unlink(tempPath).catch(() => {});
            }
        }

        // Tạo sản phẩm mới
        const newProduct = await Product.create(payload);
        return newProduct;
    }

    // Lấy sản phẩm theo ID
    static async getProductById(productId) {
        // Fetch product without lean() to retain Mongoose model instance
        const product = await Product.findById(productId).populate(['product_category_id', 'product_brand_id']);
        if (!product) {
            throw new NotFoundError('Không tìm thấy sản phẩm');
        }

        // Increment view count
        product.product_views += 1;

        // Save the updated product
        await product.save();
        // Convert to plain object for response, if needed
        return product.toObject();
    }
    static async ScanProduct(product_code) {
        const product = await Product.findOne({ product_code })
            .select('product_thumb product_price product_name product_discounted_price product_discount product_code')
            .lean();
        if (!product) throw new NotFoundError('Không tìm thấy sản phẩm');
        return product;
    }
    // Cập nhật sản phẩm (bao gồm cập nhật số lượng tồn kho nếu có)
    static async updateProduct(productId, payload) {
        if (payload?.product_thumb) {
            const randomFileName = `temp_search_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.JPG`;
            const imgDir = path.join(__dirname, 'img');
            const tempPath = path.join(imgDir, randomFileName);
            try {
                // Đảm bảo folder tồn tại
                await fs.mkdir(imgDir, { recursive: true });

                // Tải ảnh và trích xuất đặc trưng
                await downloadImage(payload.product_thumb, tempPath);
                const searchFeatures = await extractFeatures(tempPath);
                payload.product_image_features = Array.from(searchFeatures.dataSync());

                // Giải phóng Tensor
                searchFeatures.dispose();
            } catch (err) {
                console.error('Lỗi xử lý ảnh:', err);
                // Tiếp tục thêm sản phẩm mà không có đặc trưng ảnh
                payload.product_image_features = [];
            } finally {
                // Xóa file tạm
                fs.unlink(tempPath).catch(() => {});
            }
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, payload, { new: true });
        if (!updatedProduct) throw new NotFoundError('Không tìm thấy sản phẩm để cập nhật');
        return updatedProduct;
    }
    // Xóa sản phẩm
    static async deleteProduct(productId) {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) throw new NotFoundError('Không tìm thấy sản phẩm để xóa');
        return deletedProduct;
    }

    static async searchProductsByUser({ keySearch = '', limit = 10, page = 0, sort } = {}) {
        const limitNum = Math.max(~~limit || 10, 1); // Fast parse, default 10, min 1
        const pageNum = Math.max(~~page || 0, 0); // Fast parse, default 0
        const skipNum = pageNum * limitNum;

        // Sử dụng $regex để tìm kiếm gần giống
        const searchFilter = keySearch
            ? {
                  $or: [
                      { product_name: { $regex: keySearch, $options: 'i' } }, // Tìm kiếm tên sản phẩm không phân biệt chữ hoa/thường
                      { product_slug: { $regex: keySearch, $options: 'i' } }, // Tìm kiếm slug sản phẩm (nếu cần)
                  ],
              }
            : {};

        const productQuery = Product.find(searchFilter)
            .select(
                '_id product_thumb product_name product_discounted_price product_slug product_ratings product_sold product_price product_discount product_quantity product_expiry_date',
            )
            .skip(skipNum)
            .limit(limitNum)
            .lean();

        // Áp dụng sort
        if (sort) {
            productQuery.sort(sort);
        }

        const [products, totalProducts] = await Promise.all([productQuery.exec(), Product.countDocuments(searchFilter)]);

        return {
            totalPage: Math.max(Math.ceil(totalProducts / limitNum), 0),
            currentPage: pageNum,
            totalProducts,
            products,
        };
    }

    // Lấy tất cả sản phẩm (với các filter)
    static async getAllProductsByAdmin({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;
        const products = await Product.find({ product_isPublished: true })
            .select('-updatedAt -createdAt -__v')
            .sort('-createdAt')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalProducts = await Product.countDocuments({ product_isPublished: true });
        return {
            totalPage: Math.ceil(totalProducts / limitNum),
            currentPage: pageNum,
            totalProducts,
            products,
        };
    }
    // Lấy tất cả sản phẩm (với các filter)
    static async getAllProducts(query = {}) {
        // Create a copy to avoid mutating input
        const queries = { ...query };
        const excludeFields = ['limit', 'sort', 'page'];
        excludeFields.forEach((field) => delete queries[field]);

        // Transform gte, gt, lte, lt to MongoDB operators
        const queriesString = JSON.stringify(queries).replace(/\b(gte|gt|lte|lt)\b/g, (el) => `$${el}`);
        let newQueryString = JSON.parse(queriesString);

        // Add filters for category and brand if provided
        if (query.product_category_id) {
            newQueryString.product_category_id = query.product_category_id;
        }
        if (query.product_brand_id) {
            newQueryString.product_brand_id = query.product_brand_id;
        }
        // Ensure only published products are returned
        newQueryString.product_isPublished = true;
        // Build query
        let products = Product.find(newQueryString)
            .select(
                '_id product_thumb product_name product_discounted_price product_slug product_ratings product_sold product_price product_discount product_quantity',
            )
            .lean();
        // Apply sorting
        if (query.sort) {
            const sortBy = query.sort.toString().replace(',', ' ');
            products = products.sort(sortBy);
        } else {
            products = products.sort('-createdAt');
        }
        // Apply pagination
        const limit = Math.max(~~query.limit || 10, 1); // Default 10, min 1
        const page = Math.max(~~query.page || 0, 0); // Default 0
        const skip = page * limit;
        products = products.limit(limit).skip(skip);
        // Execute query and count concurrently
        const [newProducts, totalProducts] = await Promise.all([products.exec(), Product.countDocuments(newQueryString)]);
        // Return result
        return {
            success: true,
            totalPage: Math.max(Math.ceil(totalProducts / limit) - 1, 0),
            currentPage: page,
            totalProducts,
            products: newProducts, // Use executed result, not query object
        };
    }
    // Các chức năng khác (giảm giá, sản phẩm nổi bật, sản phẩm mới, v.v.)
    static async getFeaturedProducts(limit = 30) {
        return await Product.find({ product_isPublished: true })
            .sort({ product_sold: -1, product_ratings: -1 })
            .select('_id product_thumb product_name product_price product_discounted_price product_slug product_discount product_sold product_ratings')
            .limit(limit)
            .lean();
    }
    static async getFlashSaleProducts() {
        return await Product.find({
            product_discount: { $gte: 40 },
            product_isPublished: true,
        })
            .select('_id product_thumb product_sold product_discounted_price product_quantity product_name product_slug product_discount')
            .sort({ product_discount: -1 })
            .lean();
    }
    static async getNewProducts() {
        return await productModel
            .find({
                createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                product_isPublished: true,
            })
            .select('_id product_thumb product_name product_discounted_price product_slug product_ratings product_sold product_price product_discount')
            .sort({ createdAt: -1 })
            .lean();
    }
    static async getSimilarProducts(id) {
        const currentProduct = await Product.findById(id);
        if (!currentProduct) throw new NotFoundError('Sản phẩm không tồn tại');
        return await Product.find({
            _id: { $ne: id },
            product_category_id: currentProduct.product_category_id,
            product_isPublished: true,
        })
            .select('_id product_thumb product_name product_discounted_price product_slug product_ratings product_sold product_price product_discount')
            .sort({ sold_count: -1 })
            .limit(10)
            .lean();
    }
    static async getProductSuggestions(keySearch) {
        const regexSearch = new RegExp(keySearch);
        // full test search
        const products = await Product.find(
            { $text: { $search: regexSearch }, product_isPublished: true },
            { score: { $meta: 'textScore' } },
            { product_isPublished: true },
        )
            // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết
            .sort({ score: { $meta: 'textScore' } })
            .select('_id product_name product_slug')
            .limit(8)
            .lean();
        return { products };
    }
    static async searchProductByImage(imageUrl) {
        if (!imageUrl) throw new NotFoundError('Vui lòng cung cấp URL ảnh!');
        const tempPath = path.join(__dirname, 'temp_search.png');
        // Tải ảnh từ URL về thư mục tạm
        if (!(await downloadImage(imageUrl, tempPath))) throw new RequestError('Không thể tải ảnh!');
        // Trích xuất đặc trưng từ ảnh tìm kiếm
        const searchFeatures = await extractFeatures(tempPath);
        if (!searchFeatures || searchFeatures.length === 0) throw new RequestError('Không thể trích xuất đặc trưng từ ảnh!');
        // Lấy tất cả sản phẩm trong cơ sở dữ liệu (sử dụng `.lean()` để tối ưu hóa hiệu suất)
        const productFeatures = await Product.find({ product_isPublished: true }).lean();
        const results = await Promise.all(
            productFeatures.map(async (product) => {
                // Kiểm tra nếu sản phẩm không có đặc trưng hình ảnh
                if (!product.product_image_features || product.product_image_features.length === 0) {
                    return { url: product.product_thumb, similarity: 0, product };
                }
                const {
                    _id,
                    product_thumb,
                    product_name,
                    product_discounted_price,
                    product_slug,
                    product_ratings,
                    product_sold,
                    product_price,
                    product_discount,
                } = product;
                // Tính toán sự tương đồng cosine giữa ảnh tìm kiếm và sản phẩm
                const productTensor = tf.tensor1d(product.product_image_features);
                const similarity = cosineSimilarity(searchFeatures, productTensor);
                return {
                    similarity,
                    _id,
                    product_thumb,
                    product_name,
                    product_discounted_price,
                    product_slug,
                    product_ratings,
                    product_sold,
                    product_price,
                    product_discount,
                }; // Trả về thông tin sản phẩm
            }),
        );
        // Sắp xếp kết quả theo độ tương đồng giảm dần và lấy 10 sản phẩm tương tự nhất
        const sortedResults = results.filter((p) => p.similarity > 0.996).sort((a, b) => b.similarity - a.similarity);
        // Xóa tệp ảnh tạm sau khi xử lý
        await fs.unlink(tempPath).catch(() => {});
        // Trả về kết quả tìm kiếm với thông tin sản phẩm
        return sortedResults;
    }
    static async getProductsByExpiryStatus({ limit, page, status }) {
        const limitNum = parseInt(limit, 10) || 10; // Giới hạn sản phẩm mỗi trang
        const pageNum = parseInt(page, 10) || 0; // Trang hiện tại
        const skipNum = pageNum * limitNum; // Tính toán số lượng bỏ qua
        let filter = {};
        const currentDate = new Date(); // Lưu lại ngày hiện tại
        // Lọc sản phẩm theo trạng thái hết hạn
        switch (status) {
            case 'expired': // Hết hạn
                filter = {
                    product_expiry_date: { $lt: currentDate }, // Ngày hết hạn đã qua
                };
                break;
            case 'near_expiry': // Cận hạn (dưới 1 tháng nữa)
                const nearExpiryDate = new Date(currentDate);
                nearExpiryDate.setMonth(currentDate.getMonth() + 1); // Cập nhật một tháng tới
                filter = {
                    product_expiry_date: { $gte: currentDate, $lt: nearExpiryDate }, // Còn dưới 1 tháng
                };
                break;
            case 'valid': // Còn hạn (hơn 1 tháng nữa)
                const validDate = new Date(currentDate);
                validDate.setMonth(currentDate.getMonth() + 1); // Cập nhật một tháng tới
                filter = {
                    product_expiry_date: { $gte: validDate }, // Hơn 1 tháng nữa
                };
                break;
            default:
                throw new RequestError('Trạng thái hạn sử dụng không hợp lệ.');
        }
        // Lấy sản phẩm theo trạng thái
        const products = await Product.find(filter).sort('-product_expiry_date').skip(skipNum).limit(limitNum).lean();
        const totalProducts = await Product.countDocuments(filter);
        return {
            totalPage: Math.ceil(totalProducts / limitNum), // Số trang tổng cộng
            currentPage: pageNum, // Trang hiện tại
            totalProducts, // Tổng số sản phẩm
            products, // Danh sách sản phẩm
        };
    }
}

module.exports = ProductService;
