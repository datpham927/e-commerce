const express = require("express");
const ProductControllers = require("../../controllers/product.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

/* ================================
   📌 API Dành cho Người Dùng (Không cần đăng nhập)
   ================================ */
// 🔍 Tìm kiếm sản phẩm theo từ khóa
router.get("/search/search-image", asyncHandle(ProductControllers.searchProductByImage));
router.get("/search/:keySearch", asyncHandle(ProductControllers.getListSearchProduct));

// 📦 Lấy tất cả sản phẩm
router.get("/all", asyncHandle(ProductControllers.getAllProducts));

// 🌟 Lấy danh sách sản phẩm nổi bật
router.get("/featured", asyncHandle(ProductControllers.getFeaturedProducts));

// ⚡ Lấy danh sách sản phẩm giảm giá sốc
router.get("/flash-sale", asyncHandle(ProductControllers.getFlashSaleProducts));

// 🆕 Lấy danh sách sản phẩm mới nhất
router.get("/new-product", asyncHandle(ProductControllers.getNewProducts));

// 🔄 Lấy danh sách sản phẩm tương tự theo danh mục
router.get("/:id/similar", asyncHandle(ProductControllers.getSimilarProductsByCategory));

/* ================================
   🛡️ API Dành cho Admin (Quản lý Sản Phẩm)
   ================================ */
router.use(authentication); // ✅ Xác thực người dùng
router.use(restrictTo(PERMISSIONS.PRODUCT_MANAGE)); // 🚫 Chỉ admin có quyền quản lý sản phẩm

// ➕ Thêm sản phẩm mới
router.post("/add", asyncHandle(ProductControllers.createProduct));

// 🔍 Lấy thông tin sản phẩm theo ID
router.get("/:id/search", asyncHandle(ProductControllers.getProductById));

// ✏️ Cập nhật thông tin sản phẩm
router.put("/:id/update", asyncHandle(ProductControllers.updateProduct));

// ❌ Xóa sản phẩm
router.delete("/:id/delete", asyncHandle(ProductControllers.deleteProduct));

module.exports = router;
