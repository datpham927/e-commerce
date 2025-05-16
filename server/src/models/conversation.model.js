const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Một người dùng chỉ có một cuộc hội thoại duy nhất
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', conversationSchema);
