import { adminClient, authClient } from '../config/httpRequest';

// API lấy tất cả người dùng
export const apiCreateConversation = async () => {
    try {
        const res = await authClient.post('/v1/api/conversation/create');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const getAllConversationsByAdmin = async () => {
    try {
        const res = await adminClient.get('/v1/api/conversation');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export const deleteConversation = async (conversationId: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/conversation/${conversationId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API tìm kiếm cuộc hội thoại theo tên người dùng hoặc số điện thoại
export const apiSearchConversation = async (name: string) => {
    try {
        const res = await adminClient.get(`/v1/api/conversation/search`, {
            params: { name: name }, // Hoặc 'phone' nếu bạn muốn tìm theo số điện thoại
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
