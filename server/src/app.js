// // Import thư viện nén nội dung (compress responses) trước khi gửi cho client
// const compression = require("compression")
// // Import Express - framework chính để xây dựng server Node.js
// const express = require("express")
// // Import body-parser (dùng để parse request body)
// const bodyParser = require("body-parser")
// // Import morgan (ghi log chi tiết các request, phục vụ debug)
// const morgan = require("morgan")
// // Khởi tạo ứng dụng Express
// const app = express()

// // morgan("dev"): ghi log request (method, url, status, thời gian...)
// // ở chế độ "dev" (màu sắc, thông tin ngắn gọn)
// app.use(morgan("dev"))
// // compression(): nén response (gzip/deflate), giúp giảm dung lượng dữ liệu trả về
// app.use(compression())
// // express.json(): parse body JSON của request vào req.body
// app.use(express.json())
// // express.urlencoded({ extended: true }): parse body form-encoded
// // extended = true: dùng qs library, cho phép parse nested object
// app.use(express.urlencoded({
//     extended: true,
// }))
// // bodyParser.json(): cũng parse JSON body (tương tự express.json())
// // Thực tế, từ Express 4.16+ có sẵn express.json(), bodyParser có thể không cần
// app.use(bodyParser.json());

// // ====================== Khởi tạo kết nối Database ====================== //

// // require("./dbs/init.mongodb"): file này thực hiện logic kết nối MongoDB
// // require("./dbs/init.mongodb")

// // ====================== Khởi tạo routes ====================== //

// // app.use("/", require("./routes")): tất cả request bắt đầu từ "/"
// // sẽ được định nghĩa/điều hướng trong file "./routes/index.js" (hoặc tương tự)
// // app.use("/", require("./routes"))

// // ====================== Xử lý lỗi (Error Handling) ====================== //

// // Nếu không match bất kỳ route nào ở trên, sẽ chạy middleware này
// // Tạo error 404 ("Not Found") và chuyển sang middleware xử lý error
// app.use((req, res, next) => {
//     const error = new Error("Not Found")
//     error.status = 404
//     next(error)
// })
// // Middleware cuối cùng để bắt lỗi
// // error, req, res, next => format lại error, trả về client JSON
// app.use((error, req, res, next) => {
//     const statusCode = error.status || 500
//     res.status(statusCode).json({
//         status: error.message,
//         code: statusCode
//     })
// })

// // Xuất module app để các file khác (ví dụ server.js) import và chạy app.listen
// module.exports = app
