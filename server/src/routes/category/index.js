const express = require("express")
const CategoryControllers = require("../../controllers/category.controllers")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()

// asyncHandle  sử dụng cái này để bắt lỗi giống như try catch
router.post("/add", asyncHandle(CategoryControllers.createCategory))

module.exports = router