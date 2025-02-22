const crypto = require("crypto")

const randomTokenByCrypto = (bytes) => crypto.randomBytes(bytes).toString('hex');
// create a hash of the token using SHA256 algorithm
const hashTokenByCrypto = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { randomTokenByCrypto, hashTokenByCrypto }