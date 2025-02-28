const express = require("express");
const ProductControllers = require("../../controllers/product.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();


router.get("/search/:keySearch", asyncHandle(ProductControllers.getListSearchProduct))
router.get("/all", asyncHandle(ProductControllers.getAllProducts));
router.get("/featured", asyncHandle(ProductControllers.getFeaturedProducts));//Lấy sản phẩm nổi bật
router.get("/flash-sale", asyncHandle(ProductControllers.getFlashSaleProducts));
router.get("/new-product", asyncHandle(ProductControllers.getNewProducts));
router.get("/:id/similar", asyncHandle(ProductControllers.getSimilarProductsByCategory));
// =============== admin =================
router.use(authentication)
router.use(restrictTo(PERMISSIONS.PRODUCT_MANAGE))
// Thêm sản phẩm
router.post("/add", asyncHandle(ProductControllers.createProduct));
// Lấy tất cả sản phẩm (có phân trang)
// Lấy sản phẩm theo ID
router.get("/:id/search", asyncHandle(ProductControllers.getProductById));
// Cập nhật sản phẩm
router.put("/:id/update", asyncHandle(ProductControllers.updateProduct));
// Xóa sản phẩm
router.delete("/:id/delete", asyncHandle(ProductControllers.deleteProduct));

module.exports = router;
