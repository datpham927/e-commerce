const compression = require('compression'); // Nén dữ liệu để tối ưu tốc độ truyền
const express = require('express'); // Framework chính để tạo server HTTP
const bodyParser = require('body-parser'); // Phân tích body của request (dạng JSON, URL-encoded)
const { default: helmet } = require('helmet'); // Bảo vệ app khỏi các lỗ hổng bảo mật phổ biến
const morgan = require('morgan'); // Ghi log request ra console
const cors = require('cors'); // Cho phép client khác domain truy cập API
const cookieParser = require('cookie-parser'); // Phân tích cookie từ request
require('dotenv').config(); // Load biến môi trường từ file .env
const yourRouter = require('./routes/yourrouter');
const firewall = require('./middlewares/firewall.middleware');
const app = express(); // Khởi tạo ứng dụng Express

// ✅ Cấu hình CORS để cho phép các domain nhất định gọi API
app.use(
    cors({
        origin: [
            process.env.URL_CLIENT, // domain frontend từ biến môi trường
            'http://127.0.0.1:5173', // cho phép chạy local
            'http://localhost:5173',
        ],
        credentials: true, // Cho phép gửi cookie, auth header...
    }),
);

// ✅ Khởi tạo các middleware
app.use(cookieParser()); // Phân tích cookie
app.use(morgan('dev')); // Log request ra console
app.use(helmet()); // Tăng bảo mật cho app
app.use(compression()); // Nén dữ liệu phản hồi về client
app.use(express.json()); // Phân tích JSON từ request body
app.use(express.urlencoded({ extended: true })); // Phân tích dữ liệu URL-encoded
app.use(bodyParser.json()); // Phân tích JSON cho body (tương tự express.json)
const http = require('http'); // Chưa được import ở trên — thêm dòng này nếu chưa có
const { createSocket } = require('./socket');

// ✅ Kết nối database MongoDB
require('./dbs/init.mongodb');
// Cron job sẽ được khởi tạo và chạy hàng ngày lúc 00:00.
require('./cron/spinScheduler');
// ✅ Khởi tạo server HTTP (cần để gắn socket vào)

// Middleware tường lửa
app.use(firewall.ipBlocker); // ✅ là middleware function
app.use('/api', firewall.apiRateLimiter); // ✅ là middleware function
console.log('yourRouter =', yourRouter);
app.use('/api/your-resource', yourRouter); // ✅ đúng nếu yourRouter là router
// ✅ Khởi tạo các route
app.use('/', require('./routes')); // Tất cả các route được xử lý ở thư mục ./routes

// ✅ Xử lý lỗi không tìm thấy route
app.use((req, res, next) => {
    const error = new Error('Not Found'); // Tạo lỗi 404
    error.status = 404;
    next(error); // Chuyển đến middleware xử lý lỗi tiếp theo
});

// ✅ Middleware xử lý lỗi chung
app.use((error, req, res, next) => {
    const statusCode = error.status || 500; // Lấy mã lỗi, mặc định 500 nếu không có
    res.status(statusCode).json({
        success: false,
        message: error.message, // Nội dung lỗi
        code: statusCode, // Mã lỗi HTTP
    });
});
const server = http.createServer(app); // Tạo server HTTP thuần
createSocket(server); // Gắn socket.io vào server HTTP

server.listen(process.env.PORT || 4000, () => {
    console.log('Server success!');
});
// Stop run
process.on('SIGINT', () => {
    server.close(() => console.log('Exit server'));
});
