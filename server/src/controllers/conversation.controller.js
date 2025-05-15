const conversationModel = require('../models/conversation.model');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const { BadRequestError } = require('../core/error.response');
const { default: mongoose } = require('mongoose');

const createConversation = async (req, res) => {
    // Lấy ID người dùng từ request
    const userId = req.user._id;
    console.log({ userId }); // Ghi log ID người dùng để debug

    // Kiểm tra tính hợp lệ của userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Người dùng không hợp lệ',
        });
    }

    // Tìm tất cả admin không bị chặn
    const admins = await Admin.find({ admin_isBlocked: false }) // Lấy danh sách admin không bị chặn
        .populate('admin_roles') // Lấy thông tin chi tiết của admin_roles
        .lean() // Chuyển đổi sang object JavaScript để tối ưu hiệu suất
        .then((admins) =>
            admins.filter(
                (admin) =>
                    // Lọc admin có quyền message_manage hoặc admin_type là "admin"
                    admin.admin_roles.some((role) => role.role_permissions.includes('message_manage')) || admin.admin_type === 'admin',
            ),
        );
    console.log({ admins: admins.map((admin) => admin._id) }); // Ghi log ID các admin để debug

    // Kiểm tra xem có admin nào hợp lệ không
    if (!admins || admins.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Không tìm thấy admin phù hợp',
        });
    }

    // Kiểm tra xem người dùng đã có cuộc trò chuyện chưa
    const existingConversation = await conversationModel.findOne({ user: userId }).lean(); // Tìm cuộc trò chuyện hiện có
    if (existingConversation) {
        return res.status(200).json({
            success: true,
            data: existingConversation, // Trả về cuộc trò chuyện hiện có
        });
    }

    // Đếm số cuộc trò chuyện của từng admin
    const adminConversationCounts = await Promise.all(
        admins.map(async (admin) => {
            const count = await conversationModel.countDocuments({ admin: admin._id }); // Đếm số cuộc trò chuyện của admin
            return { adminId: admin._id, count }; // Trả về ID admin và số lượng
        }),
    );

    // Tìm admin có ít cuộc trò chuyện nhất
    const selectedAdmin = adminConversationCounts.reduce(
        (min, current) => (current.count < min.count ? current : min), // So sánh và chọn admin có count thấp nhất
    );
    console.log({ selectedAdmin: selectedAdmin.adminId, conversationCount: selectedAdmin.count }); // Ghi log admin được chọn

    // Kiểm tra xem có chọn được admin không
    if (!selectedAdmin || !selectedAdmin.adminId) {
        return res.status(500).json({
            success: false,
            message: 'Không thể chọn admin để gán cuộc trò chuyện',
        });
    }

    // Tạo cuộc trò chuyện mới
    const newConversation = new conversationModel({
        user: userId, // Gán người dùng
        admin: selectedAdmin.adminId, // Gán admin có ít cuộc trò chuyện nhất
        seen: true, // Đặt trạng thái đã xem
    });

    // Lưu cuộc trò chuyện vào database
    const savedConversation = await newConversation.save();
    if (!savedConversation) {
        console.error('Lỗi khi lưu cuộc trò chuyện:', { userId, adminId: selectedAdmin.adminId }); // Ghi log lỗi
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo cuộc trò chuyện',
        });
    }

    // Trả về kết quả thành công
    return res.status(201).json({
        success: true,
        message: 'Tạo cuộc trò chuyện thành công',
        data: savedConversation,
    });
};
/**
 * @desc Lấy tất cả cuộc trò chuyện
 */
const getAllConversationsByAdmin = async (req, res) => {
    try {
        // Lấy tất cả cuộc trò chuyện
        const conversation = await conversationModel.find({ admin: req.admin._id }).populate('user', 'user_avatar_url user_name').sort({ updatedAt: -1 });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Không có cuộc trò chuyện nào',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lấy cuộc trò chuyện thành công',
            data: conversation,
        });
    } catch (err) {
        console.error('Lỗi khi lấy cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy cuộc trò chuyện',
        });
    }
};

/**
 * @desc Xoá cuộc trò chuyện
 */
const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const deletedConversation = await conversationModel.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
            return res.status(404).json({
                success: false,
                message: 'Cuộc trò chuyện không tồn tại',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Xoá cuộc trò chuyện thành công',
        });
    } catch (err) {
        console.error('Lỗi khi xoá cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá cuộc trò chuyện',
        });
    }
};

/**
 * @desc Tìm cuộc hội thoại theo tên người dùng
 */
const getConversationByUserName = async (req, res) => {
    const { name } = req.query;

    try {
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu tên người dùng',
            });
        }

        const user = await User.findOne({ user_name: { $regex: name, $options: 'i' } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng',
            });
        }

        const conversation = await conversationModel
            .findOne({ user: user._id })
            .populate('user', 'user_name user_email')
            .populate('admin', 'admin_name admin_email');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cuộc hội thoại',
            });
        }

        return res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (err) {
        console.error('Lỗi khi tìm kiếm cuộc trò chuyện:', err);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá cuộc trò chuyện',
        });
    }
};


module.exports = {
    getConversationByUserName,
    createConversation,
    getAllConversationsByAdmin,
    deleteConversation,
};
