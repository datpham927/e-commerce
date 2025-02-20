


const { Types } = require("mongoose");

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

module.exports = { getSelectData, updateNestedObjectParser, getUnselectData, convertToObjectIdMongodb }