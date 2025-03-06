import { axiosJWT } from '../utils/httpRequest';

// API lấy tất cả người dùng
const apiGetAllUsers = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/users/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm người dùng mới
const apiAddUser = async (userData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/users/add', userData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin người dùng theo UID
const apiUpdateUser = async (uid: string, userData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/users/${uid}/update`, userData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa người dùng theo UID
const apiDeleteUser = async (uid: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/users/${uid}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API bật/tắt khóa người dùng theo UID
const apiToggleBlockUser = async (uid: string) => {
    try {
        const res = await axiosJWT.put(`/v1/api/users/${uid}/toggle-block`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllUsers,
    apiAddUser,
    apiUpdateUser,
    apiDeleteUser,
    apiToggleBlockUser
};
