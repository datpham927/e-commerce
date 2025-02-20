/**
 * asyncHandle - Một hàm bọc (wrapper) cho các hàm async (promise)
 * trong Express, giúp tự động bắt lỗi bằng .catch(next)
 */
const asyncHandle = (fn) => {
    // fn: route handler hoặc middleware async (req, res, next) => {...}
    return (req, res, next) => {
        // Trả về một middleware mới có tham số req, res, next
        // Gọi fn (async). Nếu fn throw error hoặc reject,
        // .catch(next) sẽ gọi next(error) => chuyển lỗi sang middleware xử lý lỗi của Express
        fn(req, res, next).catch(next);
    };
};

module.exports = asyncHandle;
