import { axiosJWT } from '../utils/httpRequest';

// API lấy lịch sử nhập hàng
const apiGetImportHistory = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/supplier/import-history');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm nhà cung cấp mới (Admin Only)
const apiCreateSupplier = async (supplierData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/supplier/add', supplierData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy tất cả nhà cung cấp
const apiGetAllSuppliers = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/supplier/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy thông tin chi tiết nhà cung cấp theo ID
const apiGetSupplierById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/supplier/${id}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin nhà cung cấp theo ID (Admin Only)
const apiUpdateSupplier = async (id: string, supplierData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/supplier/update/${id}`, supplierData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa nhà cung cấp theo ID (Admin Only)
const apiDeleteSupplier = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/supplier/delete/${id}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API nhập hàng
const apiRestock = async (restockData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/supplier/restock', restockData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetImportHistory,
    apiCreateSupplier,
    apiGetAllSuppliers,
    apiGetSupplierById,
    apiUpdateSupplier,
    apiDeleteSupplier,
    apiRestock
};
