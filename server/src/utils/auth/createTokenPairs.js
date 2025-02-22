const JWT = require("jsonwebtoken");

const createTokenPairs = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, { expiresIn: 60 * 24 * 60 * 60 });
        const refreshToken = JWT.sign(payload, privateKey, { expiresIn: 60 * 24 * 60 * 60 });
        return { accessToken, refreshToken };
    } catch (error) {
        return error.message;
    }
};
module.exports = createTokenPairs