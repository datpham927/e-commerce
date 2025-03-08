import { axiosJWT} from '../utils/httpRequest';

// Lấy tất cả thương hiệu
const apiGetAllBrands = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/brand/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy tất cả thương hiệu theo danh mục
const apiGetBrandsInCategory = async (categoryId: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/brand/${categoryId}/by-category`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Tìm kiếm thương hiệu theo tên
const apiSearchBrand = async (searchQuery: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/brand/search`, {
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

// Thêm mới thương hiệu
const apiCreateBrand = async (brandData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/brand/add', brandData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy chi tiết thương hiệu theo ID
const apiGetBrandById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/brand/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật thương hiệu theo ID
const apiUpdateBrand = async (id: string, brandData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/brand/${id}/update`, brandData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa thương hiệu theo ID
const apiDeleteBrand = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/brand/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllBrands,
    apiGetBrandsInCategory,
    apiSearchBrand,
    apiCreateBrand,
    apiGetBrandById,
    apiUpdateBrand,
    apiDeleteBrand,
};
