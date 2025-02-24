const express = require("express");
const BannerController = require("../../controllers/banner.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

//tìm theo tên
router.get("/search", asyncHandle(BannerController.searchBanner));

// Thêm banner
router.post("/add", asyncHandle(BannerController.createBanner));

// Lấy tất cả banner (có phân trang)
router.get("/all", asyncHandle(BannerController.getAllBanners));

// Lấy banner theo ID
router.get("/:id", asyncHandle(BannerController.getBannerById));

// Cập nhật banner
router.put("/update/:id", asyncHandle(BannerController.updateBanner));

// Xóa banner
router.delete("/:id", asyncHandle(BannerController.deleteBanner));


module.exports = router;
