const express = require('express');
const ProductController = require('../../controllers/product.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

/* ================================
   📌 API Dành cho Người Dùng (Không cần đăng nhập)
   ================================ */
// 🔍 Tìm kiếm sản phẩm theo từ khóa
router.post('/search/search-image', asyncHandle(ProductController.searchProductByImage));
router.get('/search/:keySearch', asyncHandle(ProductController.getListSearchProduct));
// 📦 Lấy tất cả sản phẩm
router.get('/all', asyncHandle(ProductController.getAllProducts));
// 🔍 Lấy thông tin sản phẩm theo ID
router.get('/:id/detail', asyncHandle(ProductController.getProductById));
// 🌟 Lấy danh sách sản phẩm nổi bật
router.get('/featured', asyncHandle(ProductController.getFeaturedProducts));
// ⚡ Lấy danh sách sản phẩm giảm giá sốc
router.get('/flash-sale', asyncHandle(ProductController.getFlashSaleProducts));
// 🆕 Lấy danh sách sản phẩm mới nhất
router.get('/new-product', asyncHandle(ProductController.getNewProducts));
// 🔄 Lấy danh sách sản phẩm tương tự theo danh mục
router.get('/:id/similar', asyncHandle(ProductController.getSimilarProducts));
router.get('/suggestion/:keySearch', asyncHandle(ProductController.getProductSuggestions));
router.get('/top-viewed', asyncHandle(ProductController.getTopViewedProduct));
//Sản phẩm bạn quan tâm
router.post('/track-view', [userAuthentication], asyncHandle(ProductController.trackCategoryView));
router.get('/recommendations', [userAuthentication], asyncHandle(ProductController.recommendByTopCategories));
/* ================================
   🛡️ API Dành cho Admin (Quản lý Sản Phẩm)
   ================================ */
router.use(adminAuthentication); // ✅ Xác thực người dùng
router.use(restrictTo(PERMISSIONS.PRODUCT_MANAGE)); //
router.get('/all-products', asyncHandle(ProductController.getAllProductsByAdmin));
// ➕ Thêm sản phẩm mới (bao gồm thông tin tồn kho)
router.post('/add', asyncHandle(ProductController.createProduct));

router.get('/offline-orders/scan-product', asyncHandle(ProductController.ScanProduct));
// ✏️ Cập nhật sản phẩm
router.put('/:id/update', asyncHandle(ProductController.updateProduct));

// ❌ Xóa sản phẩm
router.delete('/:id/delete', asyncHandle(ProductController.deleteProduct));

// API lấy sản phẩm theo trạng thái hạn sử dụng
router.get('/expiry-status/:status', asyncHandle(ProductController.getProductsByExpiryStatus));

module.exports = router;
