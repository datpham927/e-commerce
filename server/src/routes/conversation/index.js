const express = require('express');
const {
    createConversation,
    getAllConversationsByAdmin,
    deleteConversation,
    getConversationByUserName,
    getAllConversations,
} = require('../../controllers/conversation.controller');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

// Route tạo cuộc trò chuyện mới
router.post('/create', [userAuthentication], createConversation);
// Route lấy tất cả cuộc trò chuyện

router.use(adminAuthentication);
router.get('/all-by-admin', getAllConversations);

router.use(restrictTo(PERMISSIONS.MESSAGE_MANAGE));
// lấy tất cả cuộc hội thoại
router.get('/', getAllConversationsByAdmin);
// Route xóa cuộc trò chuyện
router.delete('/:conversationId', deleteConversation);
router.get('/search', getConversationByUserName);

module.exports = router;
