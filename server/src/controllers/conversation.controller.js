const conversationModel = require('../models/conversation.model');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const { BadRequestError } = require('../core/error.response');
const { default: mongoose } = require('mongoose');

const createConversation = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Người dùng không hợp lệ',
            });
        }
        // Lọc ra các admin hợp lệ có quyền quản lý tin nhắn
        const allAdmins = await Admin.find({ admin_type: 'employee' }).populate('admin_roles').lean();
        const validAdmins = allAdmins.filter((admin) => admin.admin_roles?.some((role) => role.role_permissions.includes('message_manage')));
        console.log(allAdmins);
        if (!validAdmins.length) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy admin phù hợp',
            });
        }

        // Kiểm tra xem người dùng đã có cuộc trò chuyện chưa
        const existingConversation = await conversationModel.findOne({ user: userId }).lean();

        if (existingConversation) {
            const adminInfo = await Admin.findById(existingConversation.admin).select('admin_name admin_avatar_url').lean();

            return res.status(200).json({
                success: true,
                data: existingConversation,
                admin: adminInfo,
            });
        }

        // Đếm số cuộc trò chuyện của từng admin
        const adminCounts = await Promise.all(
            validAdmins.map(async (admin) => {
                const count = await conversationModel.countDocuments({ admin: admin._id });
                return { adminId: admin._id, count };
            }),
        );

        // Chọn admin có số cuộc trò chuyện ít nhất
        const leastBusyAdmin = adminCounts.reduce((min, current) => (current.count < min.count ? current : min));

        if (!leastBusyAdmin?.adminId) {
            return res.status(500).json({
                success: false,
                message: 'Không thể chọn admin để tạo cuộc trò chuyện',
            });
        }

        // Tạo cuộc trò chuyện mới
        const newConversation = await conversationModel.create({
            user: userId,
            admin: leastBusyAdmin.adminId,
            seen: true,
        });

        const adminInfo = await Admin.findById(leastBusyAdmin.adminId).select('admin_name admin_avatar_url').lean();

        return res.status(201).json({
            success: true,
            message: 'Tạo cuộc trò chuyện thành công',
            data: newConversation,
            admin: adminInfo,
        });
    } catch (error) {
        console.error('Lỗi trong createConversation:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi server',
        });
    }
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
 * @desc Lấy tất cả cuộc trò chuyện
 */
const getAllConversations = async (req, res) => {
    try {
        // Lấy tất cả cuộc trò chuyện
        const conversation = await conversationModel.find().populate('user', 'user_avatar_url user_name').sort({ updatedAt: -1 });
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
    getAllConversations,
};
