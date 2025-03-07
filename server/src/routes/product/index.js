const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

/* ================================
   📌 API Dành cho Người Dùng (Không cần đăng nhập)
   ================================ */
// 🔍 Tìm kiếm sản phẩm theo từ khóa
router.get("/search/:keySearch", asyncHandle(ProductController.getListSearchProduct));

// 📦 Lấy tất cả sản phẩm
router.get("/all", asyncHandle(ProductController.getAllProducts));

// 🌟 Lấy danh sách sản phẩm nổi bật
router.get("/featured", asyncHandle(ProductController.getFeaturedProducts));

// ⚡ Lấy danh sách sản phẩm giảm giá sốc
router.get("/flash-sale", asyncHandle(ProductController.getFlashSaleProducts));

// 🆕 Lấy danh sách sản phẩm mới nhất
router.get("/new-product", asyncHandle(ProductController.getNewProducts));

// 🔄 Lấy danh sách sản phẩm tương tự theo danh mục
router.get("/:id/similar", asyncHandle(ProductController.getSimilarProductsByCategory));

/* ================================
   🛡️ API Dành cho Admin (Quản lý Sản Phẩm)
   ================================ */
router.use(authentication); // ✅ Xác thực người dùng
router.use(restrictTo(PERMISSIONS.PRODUCT_MANAGE)); // 🚫 Chỉ admin có quyền quản lý sản phẩm

// ➕ Thêm sản phẩm mới (bao gồm thông tin tồn kho)
router.post("/add", asyncHandle(ProductController.createProduct));

// 🔍 Lấy thông tin sản phẩm theo ID
router.get("/:id/search", asyncHandle(ProductController.getProductById));

// ✏️ Cập nhật sản phẩm
router.put("/:id/update", asyncHandle(ProductController.updateProduct));

// ❌ Xóa sản phẩm
router.delete("/:id/delete", asyncHandle(ProductController.deleteProduct));

module.exports = router;
