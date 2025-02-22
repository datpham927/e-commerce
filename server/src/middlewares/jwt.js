const jwt = require('jsonwebtoken')
require("dotenv").config()

const generateAccessToken = (_id, isAdmin) => jwt.sign({ _id, isAdmin }, process.env.ACCESS_TOKEN, { expiresIn: "365d" })
const generateRefreshToken = (_id) => jwt.sign({ _id }, process.env.REFRESH_TOKEN, { expiresIn: "365d" })
const verifyRefreshToken = (refresh_token) => jwt.verify(refresh_token, process.env.REFRESH_TOKEN)


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}