import { axiosJWT} from '../utils/httpRequest';

// Lấy tất cả banners
const apiGetAllBanners = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/banner/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Tìm banner theo tên
const apiSearchBanner = async (searchQuery: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/banner/search`, {
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

// Thêm banner mới
const apiCreateBanner = async (bannerData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/banner/add', bannerData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy banner theo ID
const apiGetBannerById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/banner/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật banner theo ID
const apiUpdateBanner = async (id: string, bannerData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/banner/${id}/update`, bannerData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa banner theo ID
const apiDeleteBanner = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/banner/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllBanners,
    apiSearchBanner,
    apiCreateBanner,
    apiGetBannerById,
    apiUpdateBanner,
    apiDeleteBanner,
};
