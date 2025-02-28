"user strict"
const { Types } = require("mongoose")
const { convertToObjectIdMongodb } = require("../../utils")
const productModel = require("../product.model")


const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.find(query).
        populate("product_shop", "name email -_id")
        .sort({ updated: -1 })
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const updateProductById = async ({ id, payload, isNew = true }) => {
    return await productModel.findByIdAndUpdate(id, payload, { new: isNew })
}




const unPublicProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await productModel.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: new Types.ObjectId(product_shop)
    })
    if (!foundProduct) return null
    foundProduct.isDraft = true
    foundProduct.isPublished = false
    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    // update success ? modifiedCount=1 : modifiedCount=0
    return modifiedCount
}
const searchProductByUser = async ({ keySearch }) => {
    //RegExp Biểu thức chính quy được sử dụng để tìm kiếm và so khớp các chuỗi dựa trên một mẫu cụ thể.
    const regexSearch = new RegExp(keySearch)
    // full test search
    const result = await productModel.find({ $text: { $search: regexSearch } },
        { score: { $meta: "textScore" } })
        // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết quả
        .sort({ score: { $meta: "textScore" } }).lean()
    return result

}
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortby = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const products = await productModel
        .find(filter)
        .sort(sortby)
        .skip(skip)
        .select(select)
        .lean()
    return products
}

const findProductById = async (productId) => {
    return await productModel.findById(convertToObjectIdMongodb(productId))
}
const checkProductByServer = async (products) => {
    return Promise.all(products.map(async (product) => {
        const foundProduct = await findProductById(convertToObjectIdMongodb(product.productId));
        if (foundProduct) {
            return {
                productId: productModel.productId,
                price: foundProduct.product_price,
                quantity: productModel.quantity,
            }
        }
    }))
}


module.exports = { findAllDraftsForShop, checkProductByServer, findProductById, updateProductById, findAllProducts, searchProductByUser, unPublicProductByShop }