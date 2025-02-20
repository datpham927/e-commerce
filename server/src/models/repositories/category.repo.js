const { convertToObjectIdMongodb } = require("../../utils")
const Category = require("../category.model")


const findCartById = async (cartId) => {
    return await Category.findById({ _id: convertToObjectIdMongodb(cartId) }).lean()
}

module.exports = findCartById