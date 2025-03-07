const compression = require("compression")
const express = require("express")
const bodyParser = require("body-parser")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express()

// ✅ Middleware
app.use(cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
}));
  
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