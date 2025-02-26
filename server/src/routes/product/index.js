const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandle = require("../../helper/asyncHandle");
const insertProductsData = require("../../../dataInsert/insertProduct");

const router = express.Router();

// Tìm kiếm sản phẩm theo tên
router.get("/search", asyncHandle(ProductController.searchProducts));
// Thêm sản phẩm
router.post("/add", asyncHandle(ProductController.createProduct));
// Lấy tất cả sản phẩm (có phân trang)
router.get("/all", asyncHandle(ProductController.getAllProducts));
// Lấy sản phẩm theo ID
router.get("/:id/search", asyncHandle(ProductController.getProductById));
// Cập nhật sản phẩm
router.put("/:id/update", asyncHandle(ProductController.updateProduct));
// Xóa sản phẩm
router.delete("/:id/delete", asyncHandle(ProductController.deleteProduct));

module.exports = router;
