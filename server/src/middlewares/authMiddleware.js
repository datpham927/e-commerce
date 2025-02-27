const asyncHandle = require("../helper/asyncHandle");
const { findUserById } = require("../models/repositories/user.repo");
const Role = require("../models/role.model");
const userModel = require("../models/user.model");
const verifyAccessToken = require("../utils/auth/verifyAccessToken");

const authentication = asyncHandle(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Yêu cầu xác thực",
        });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
        });
    }
    const user = await userModel.findById(decodedToken._id).populate("user_roles"); // Lấy luôn thông tin quyền
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Token truy cập không hợp lệ",
        });
    }
    req.user = user;
    next();
});

const restrictTo = (requiredPermission) =>
    asyncHandle(async (req, res, next) => {
        const { user } = req;
        if (user.user_type === "user") {
            return res.status(403).json({
                success: false, message: "Không có quyền truy cập",
            });
        }
        // Nếu là admin thì cho phép truy cập ngay lập tức
        if (user.user_type === "admin") { return next() }
        // Lấy danh sách quyền từ các role của employee
        const userPermissions = user.user_roles.flatMap((role) => role.permissions);
        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: `Yêu cầu quyền "${requiredPermission}" để thực hiện hành động này`,
            });
        }

        next();
    });

module.exports = { authentication, restrictTo };
