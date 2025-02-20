const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandle = require("../../helper/asyncHandle");
const router = express.Router();

// Thêm sản phẩm
router.post("/add", asyncHandle(ProductController.createProduct));

// Lấy tất cả sản phẩm (có phân trang)
router.get("/all", asyncHandle(ProductController.getAllProducts));

// Lấy sản phẩm theo ID
router.get("/:id", asyncHandle(ProductController.getProductById));

// Cập nhật sản phẩm
router.put("/:id", asyncHandle(ProductController.updateProduct));

// Xóa sản phẩm
router.delete("/:id", asyncHandle(ProductController.deleteProduct));

module.exports = router;
