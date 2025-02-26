const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ["admin", "user"], required: true },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false }, // Xác nhận tin nhắn đã đọc hay chưa
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model("Message", MessageSchema);
