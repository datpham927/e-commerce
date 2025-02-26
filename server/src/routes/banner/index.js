const express = require("express");
const BannerController = require("../../controllers/banner.controller");
const asyncHandle = require("../../helper/asyncHandle");
const requireAdmin = require("../../middlewares/requireAdmin");
const authentication = require("../../middlewares/authentication");

const router = express.Router();


router.use(authentication)
router.get("/all", asyncHandle(BannerController.getAllBanners));



//tìm theo tên
router.get("/search", asyncHandle(BannerController.searchBanner));
// Thêm banner
router.post("/add", asyncHandle(BannerController.createBanner));
// Lấy tất cả banner (có phân trang)
// Lấy banner theo ID
router.get("/:id/search", asyncHandle(BannerController.getBannerById));
// Cập nhật banner
router.put("/:id/update", asyncHandle(BannerController.updateBanner));
// Xóa banner
router.delete("/:id/delete", asyncHandle(BannerController.deleteBanner));
module.exports = router;
