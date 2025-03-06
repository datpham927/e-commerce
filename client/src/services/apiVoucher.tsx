import { axiosJWT } from '../utils/httpRequest';

// API lấy tất cả voucher
const apiGetAllVouchers = async () => {
    try {
        const res = await axiosJWT.get('/v1/api/voucher/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API tìm kiếm voucher theo tên
const apiSearchVoucherByName = async (name: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/voucher/search?name=${name}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm mới voucher
const apiAddVoucher = async (voucherData: object) => {
    try {
        const res = await axiosJWT.post('/v1/api/voucher/add', voucherData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy chi tiết voucher theo ID
const apiGetVoucherById = async (id: string) => {
    try {
        const res = await axiosJWT.get(`/v1/api/voucher/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật voucher theo ID
const apiUpdateVoucher = async (id: string, voucherData: object) => {
    try {
        const res = await axiosJWT.put(`/v1/api/voucher/${id}/update`, voucherData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa voucher theo ID
const apiDeleteVoucher = async (id: string) => {
    try {
        const res = await axiosJWT.delete(`/v1/api/voucher/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllVouchers,
    apiSearchVoucherByName,
    apiAddVoucher,
    apiGetVoucherById,
    apiUpdateVoucher,
    apiDeleteVoucher
};
