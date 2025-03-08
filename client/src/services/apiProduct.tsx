import { axiosJWT } from '../utils/httpRequest';

// API tìm kiếm sản phẩm theo từ khóa
const apiSearchProduct = async (keySearch: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/product/search/${keySearch}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy tất cả sản phẩm
const apiGetAllProducts = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/product/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm nổi bật
const apiGetFeaturedProducts = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/product/featured');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm giảm giá sốc
const apiGetFlashSaleProducts = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/product/flash-sale');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm mới nhất
const apiGetNewProducts = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/product/new-product');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm tương tự theo danh mục
const apiGetSimilarProductsByCategory = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/product/${id}/similar`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm sản phẩm mới (Dành cho admin)
const apiCreateProduct = async (productData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/product/add', productData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy thông tin sản phẩm theo ID (Dành cho admin)
const apiGetProductById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/product/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin sản phẩm (Dành cho admin)
const apiUpdateProduct = async (id: string, productData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/product/${id}/update`, productData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa sản phẩm (Dành cho admin)
const apiDeleteProduct = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/product/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiSearchProduct,
    apiGetAllProducts,
    apiGetFeaturedProducts,
    apiGetFlashSaleProducts,
    apiGetNewProducts,
    apiGetSimilarProductsByCategory,
    apiCreateProduct,
    apiGetProductById,
    apiUpdateProduct,
    apiDeleteProduct,
};
