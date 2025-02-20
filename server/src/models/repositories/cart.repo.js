const { convertToObjectIdMongodb } = require("../../utils")
const Cart = require("../cart.model")


const findCartById = async (cartId) => {
    return await Cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_status: "active" }).lean()
}

module.exports = findCartById