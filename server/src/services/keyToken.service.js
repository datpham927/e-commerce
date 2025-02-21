const { Types } = require("mongoose")
const KeyTokenModel = require("../models/KeyToken.models")
const userModel = require("../models/user.model")

// lưu token vào database
class KeyTokenService {
    static createKeyToken = async ({ userId, privateKey, refreshToken, publicKey }) => {
        const filter = { userId: userId }
        const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }
        const options = { upsert: true, new: true }
        // upsert: true cho phép tạo mới một document nếu không tìm thấy document nào phù hợp với điều kiện tìm kiếm. Nếu document đã tồn tại, nó sẽ được cập nhật.
        // new: true chỉ định rằng kết quả trả về sau khi tạo hoặc cập nhật document sẽ là document mới nhất.
        //  ---------
        try {
            const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens : null
        } catch (error) {
            return error
        }
    }
    static findByIdUser = async (userId) => {
        return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }
    static removeByIdUser = async (userId) => {
        return await KeyTokenModel.findOneAndDelete({ user: userId })
    }
    // tìm refreshToken đã được sử dụng hay chưa
    static findByRefreshTokensUsed = async (refreshToken) => {
        return await KeyTokenModel.findOne({ refreshTokensUsed: refreshToken })
    }
    // static findUsedByRefreshToken = async (refreshToken) => {
    //     return await shopModel.findOne({ refreshToken })
    // }

}

module.exports = KeyTokenService