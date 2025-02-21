


const { Types } = require("mongoose");

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

module.exports = { convertToObjectIdMongodb }