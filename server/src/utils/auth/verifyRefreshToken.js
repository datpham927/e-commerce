const jwt = require('jsonwebtoken')
require("dotenv").config()

const verifyRefreshToken = (refreshToken) => jwt.verify(refreshToken, process.env.REFRESH_SECRET)


module.exports = verifyRefreshToken