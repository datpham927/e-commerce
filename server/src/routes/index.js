const express = require("express")
const router = express.Router()

// ------- auth ----------
router.use("/v1/api/auth", require("./auth/index"))

// ===============================

router.use("/v1/api/category", require("./category/index"))
router.use("/v1/api/product", require("./product/index"))
router.use("/v1/api/brand", require("./brand/index"))
router.use("/v1/api/banner", require("./banner/index"))
router.use("/v1/api/cart", require("./cart/index"))
router.use("/v1/api/shippingCompany", require("./shippingCompany/index"))
router.use("/v1/api/voucher", require("./voucher/index"))
router.use("/v1/api/favorite", require("./favoriteProduct/index"));
router.use("/v1/api/notification", require("./notification/index"))
router.use("/v1/api/supplier", require("./supplier/index"))
router.use("/v1/api/users", require("./user/index"))
router.use("/v1/api/role", require("./role/index"))

module.exports = router
