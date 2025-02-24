const JWT = require("jsonwebtoken");
const asyncHandle = require("../helper/asyncHandle");
const { ErrorResponse } = require("../core/error.response");
const verifyAccessToken = require("../utils/auth/verifyAccessToken");
const { findUserById } = require("../models/repositories/user.repo");

const HEADER = {
    AUTHORIZATION: "authorization",
}

const authentication = asyncHandle(async (req, res, next) => {
    const authorizationHeader = req.headers[HEADER.AUTHORIZATION]
    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1];
        // Giải mã access token sử dụng chữ ký được chia sẻ giữa máy chủ và client
        const decodedToken = verifyAccessToken(accessToken);
        // Tìm kiếm user liên quan đến access token
        const user = await findUserById(decodedToken._id)
        if (!user) throw new ErrorResponse("invalid user", 201)
        // Lưu thông tin user vào request object để sử dụng cho các request handlers sau này
        req.userId = user._id;
        next(); // Cho phép request đi tiếp
    } else {
        return res.status(401).json({
            success: false,
            message: "Require authentication"
        });
    }
});

module.exports = authentication;
