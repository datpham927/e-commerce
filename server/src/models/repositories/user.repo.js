const { convertToObjectIdMongodb } = require("../../utils")
const User = require("../user.model")


const findUserByEmail = async (email) => {
    return await User.findOne({ user_email: email }).lean()
}

module.exports = { findUserByEmail }