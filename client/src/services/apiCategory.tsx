import { axiosJWT } from '../utils/httpRequest';

// Lấy tất cả danh mục
const apiGetAllCategories = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/category/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Tìm kiếm danh mục theo tên
const apiSearchCategory = async (searchQuery: string) => {
    try {
        const res = await axiosJWT.get('/v1/api/category/search', {
            params: { search: searchQuery },
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Thêm mới danh mục
const apiCreateCategory = async (categoryData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/category/add', categoryData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy danh mục theo ID
const apiGetCategoryById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/category/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật danh mục
const apiUpdateCategory = async (id: string, categoryData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/category/${id}/update`, categoryData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa danh mục
const apiDeleteCategory = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/category/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllCategories,
    apiSearchCategory,
    apiCreateCategory,
    apiGetCategoryById,
    apiUpdateCategory,
    apiDeleteCategory,
};
