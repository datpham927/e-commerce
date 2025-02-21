const User = require("../models/User");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const verifyAccessToken = async (req, res, next) => {
    try {
        // Lấy access token từ header
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const accessToken = authorizationHeader.split(' ')[1];
            // Giải mã access token sử dụng chữ ký được chia sẻ giữa máy chủ và client
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            // Tìm kiếm user liên quan đến access token
            const user = await User.findById(decodedToken._id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            }
            // Lưu thông tin user vào request object để sử dụng cho các request handlers sau này
            req.userId = user._id;
            next(); // Cho phép request đi tiếp
        } else {
            return res.status(401).json({
                success: false,
                message: "Require authentication"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        // Lấy access token từ header
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const accessToken = authorizationHeader.split(' ')[1];
            // Giải mã access token sử dụng chữ ký được chia sẻ giữa máy chủ và client
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            // Tìm kiếm user liên quan đến access token
            const user = await User.findById(decodedToken._id);
            if (!user.isAdmin) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            }
            req.userId = user._id
            next(); // Cho phép request đi tiếp
        } else {
            return res.status(401).json({
                success: false,
                message: "Require authentication"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { verifyAccessToken, verifyAdmin }