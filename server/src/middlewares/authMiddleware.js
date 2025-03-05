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

        // Nếu người dùng có user_type là 'user', họ không thể truy cập các chức năng của admin
        if (user.user_type === "user") {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập",
            });
        }

        // Nếu người dùng là admin, cho phép truy cập
        if (user.user_type === "admin") {
            return next();
        }

        // Nếu người dùng không có quyền (user_roles rỗng hoặc không có quyền cụ thể)
        if (!user.user_roles || user.user_roles.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập",
            });
        }

        // Kiểm tra quyền từ các role của người dùng
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
