import { axiosJWT } from '../utils/httpRequest';

// API lấy tất cả vai trò
const apiGetAllRoles = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/role/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy vai trò theo ID
const apiGetRoleById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/role/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API tìm kiếm vai trò theo tên
const apiGetRoleByName = async (name: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/role/search`, {
            params: { name }
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API tạo vai trò mới (Dành cho admin)
const apiCreateRole = async (roleData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/role/add', roleData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật vai trò (Dành cho admin)
const apiUpdateRole = async (id: string, roleData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/role/${id}/update`, roleData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa vai trò (Dành cho admin)
const apiDeleteRole = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/role/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllRoles,
    apiGetRoleById,
    apiGetRoleByName,
    apiCreateRole,
    apiUpdateRole,
    apiDeleteRole
};
