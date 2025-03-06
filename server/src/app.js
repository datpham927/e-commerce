const compression = require("compression")
const express = require("express")
const bodyParser = require("body-parser")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express()

// CORS middleware để cho phép yêu cầu từ các cổng khác (như từ frontend)
const corsOptions = {
    origin: "http://localhost:5173", // Chỉ định cổng frontend, có thể thay đổi
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  
//init middlewares
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
app.use(bodyParser.json());

//init db
require("./dbs/init.mongodb")
//init routes
app.use("/", require("./routes"))
//handle error
app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: error.message,
        code: statusCode
    })
})

module.exports = app