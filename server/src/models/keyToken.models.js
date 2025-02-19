"use strict"
const mongoose = require('mongoose'); // Erase if already required
const { Schema } = require('mongoose');

// Declare the Schema of the Mongo model
// Lưu trữ key jwt
const KeyTokenSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    // sử  dụng rồi mà sử dụng lần nữa thì nguy cơ bị hack
    refreshTokensUsed: {
        type: Array, default: [] //đã sử dụng
    },
    refreshToken: {  // đang sử dụng
        type: String,
        required: true,
    }

});

//Export the model
module.exports = mongoose.model('KeyToken', KeyTokenSchema);