const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        // Có thể lưu thêm trường lastMessage, lastSender, ...
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
