const jwt = require('jsonwebtoken')
require("dotenv").config()

const verifyAccessToken = (accessToken) => jwt.verify(accessToken, process.env.ACCESS_SECRET)


module.exports = verifyAccessToken