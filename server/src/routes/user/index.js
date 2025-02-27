const express = require("express");
const UserController = require("../../controllers/user.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", asyncHandle(UserController.addUser));
router.put("/:uid/update", asyncHandle(UserController.updateUser));
router.delete("/:uid/delete", asyncHandle(UserController.deleteUser));
router.put("/:uid/toggle-block", asyncHandle(UserController.toggleBlockUser));

module.exports = router;