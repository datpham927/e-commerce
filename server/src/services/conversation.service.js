"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");

class ConversationService {
  // Tự động lấy hoặc tạo cuộc hội thoại giữa User và Admin khi người dùng bấm vào biểu tượng tin nhắn
  static async getOrCreateConversation(userId) {
    if (!userId) throw new BadRequestError("Thiếu ID người dùng.");

    // Tìm một Admin (ở đây lấy admin đầu tiên, có thể mở rộng sau)
    const admin = await User.findOne({ user_type: "admin" }).select("_id");
    if (!admin) throw new NotFoundError("Không có Admin nào để nhắn tin.");

    // Kiểm tra xem cuộc hội thoại giữa user và admin đã tồn tại chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, admin._id] },
    });

    // Nếu chưa có, tạo hội thoại mới
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, admin._id],
      });
    }

    return conversation;
  }

  // Lấy danh sách hội thoại của người dùng hoặc admin
  static async getUserConversations(userId, userRole) {
    if (!userId) throw new BadRequestError("Thiếu ID người dùng.");

    let conversations;
    if (userRole === "admin") {
      // Admin có thể thấy tất cả cuộc hội thoại
      conversations = await Conversation.find()
        .populate("participants", "user_name user_email user_type")
        .lean();
    } else {
      // Người dùng chỉ thấy cuộc hội thoại của họ
      conversations = await Conversation.find({ participants: userId })
        .populate("participants", "user_name user_email user_type")
        .lean();
    }

    if (!conversations.length) throw new NotFoundError("Không có hội thoại nào.");

    return conversations;
  }
}

module.exports = ConversationService;
