import { axiosJWT } from '../utils/httpRequest';

// API lấy danh sách thông báo của người dùng
const apiGetUserNotifications = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/notification');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API đánh dấu thông báo là đã đọc
const apiMarkNotificationAsRead = async (notificationId: string) => {
    try {
        const res = await axiosJWT.put(`/v1/api/notification/${notificationId}/read`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetUserNotifications,
    apiMarkNotificationAsRead,
};
