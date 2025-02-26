const JWT = require('jsonwebtoken')
require("dotenv").config()

const verifyAccessToken = (accessToken) => JWT.verify(accessToken, process.env.ACCESS_SECRET)


module.exports = verifyAccessToken