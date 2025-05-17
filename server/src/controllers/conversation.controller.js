const conversationModel = require('../models/conversation.model');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const { BadRequestError } = require('../core/error.response');
const { default: mongoose } = require('mongoose');
const createConversation = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log({ userId });

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Người dùng không hợp lệ',
            });
        }

        // Lấy danh sách admin hợp lệ
        const admins = await Admin.find({ admin_isBlocked: false })
            .populate('admin_roles')
            .lean()
            .then((admins) =>
                admins.filter((admin) => admin.admin_roles.some((role) => role.role_permissions.includes('message_manage')) || admin.admin_type === 'admin'),
            );

        console.log({ admins: admins.map((admin) => admin._id) });

        if (!admins || admins.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy admin phù hợp',
            });
        }

        // Kiểm tra nếu người dùng đã có cuộc trò chuyện
        const existingConversation = await conversationModel.findOne({ user: userId }).lean();
        if (existingConversation) {
            // Lấy thông tin admin tương ứng
            const adminData = await Admin.findById(existingConversation.admin).select('admin_name admin_avatar_url').lean();

            return res.status(200).json({
                success: true,
                data: existingConversation,
                admin: adminData,
            });
        }

        // Đếm số cuộc trò chuyện của mỗi admin
        const adminConversationCounts = await Promise.all(
            admins.map(async (admin) => {
                const count = await conversationModel.countDocuments({ admin: admin._id });
                return { adminId: admin._id, count };
            }),
        );

        // Chọn admin có ít cuộc trò chuyện nhất
        const selectedAdmin = adminConversationCounts.reduce((min, current) => (current.count < min.count ? current : min));

        console.log({
            selectedAdmin: selectedAdmin.adminId,
            conversationCount: selectedAdmin.count,
        });

        if (!selectedAdmin || !selectedAdmin.adminId) {
            return res.status(500).json({
                success: false,
                message: 'Không thể chọn admin để gán cuộc trò chuyện',
            });
        }

        // Tạo cuộc trò chuyện mới
        const newConversation = new conversationModel({
            user: userId,
            admin: selectedAdmin.adminId,
            seen: true,
        });

        const savedConversation = await newConversation.save();
        if (!savedConversation) {
            console.error('Lỗi khi lưu cuộc trò chuyện:', {
                userId,
                adminId: selectedAdmin.adminId,
            });
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi tạo cuộc trò chuyện',
            });
        }

        // Lấy thông tin admin (chỉ tên và avatar)
        const adminData = await Admin.findById(selectedAdmin.adminId).select('admin_name admin_avatar_url').lean();

        return res.status(201).json({
            success: true,
            message: 'Tạo cuộc trò chuyện thành công',
            data: savedConversation,
            admin: adminData,
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
