const authenticationUser = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']; // Lấy header authorization
    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1]; // Tách access token ra
        try {
            // Giải mã access token và kiểm tra token hợp lệ
            const decodedToken = verifyAccessToken(accessToken); // Giả sử verifyAccessToken là hàm của bạn
            req.userId = decodedToken._id; // Lưu thông tin userId vào req
            next(); // Tiếp tục với request
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing"
        });
    }
};

module.exports = authenticationUser;
