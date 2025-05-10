/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminClient, authClient } from '../config/httpRequest';

const apiGetAllOrders = async (status: string) => {
    try {
        const res = await adminClient.get('/v1/api/order/all', { params: { status } });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiUpdateOrderStatus = async (data: { orderId: string; newStatus: string }) => {
    try {
        const res = await adminClient.put('/v1/api/order/update-status', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const getOrder = async (orderId: any) => {
    try {
        const res = await adminClient.get(`/v1/api/order/${orderId}/detail`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách thông báo của người dùng
const apiGetAllOfflineOrders = async (queries: { limit: number; page: number } | any) => {
    try {
        const res = await adminClient.get('/v1/api/order/offline-all', {
            params: queries,
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiCreateOfflineOrders = async (data: any) => {
    try {
        const res = await adminClient.post('/v1/api/order/add-offline', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiGetOrderByCode = async (orderCode: string) => {
    try {
        const res = await adminClient.get(`/v1/api/order/search/${orderCode}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API tìm kiếm đơn hàng offline theo mã đơn hàng
const apiGetOfflineOrderByCode = async (orderCode: string) => {
    try {
        const res = await adminClient.get(`/v1/api/order/offline/search/${orderCode}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// --------------------

const apiGetAllOrdersByUser = async (status: string) => {
    try {
        const res = await authClient.get('/v1/api/order/by-user', { params: { status } });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiCancelOrder = async (id: string) => {
    try {
        const res = await authClient.put(`/v1/api/order/${id}/cancel`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiReorder = async (id: string, address: any) => {
    try {
        const res = await authClient.put(`/v1/api/order/${id}/re-order`, { address });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

const apiCreateOrders = async (data: any) => {
    try {
        const res = await authClient.post('/v1/api/order/add', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export {
    apiReorder,
    apiCreateOrders,
    apiCancelOrder,
    apiGetAllOrdersByUser,
    apiGetOfflineOrderByCode,
    apiGetOrderByCode,
    apiGetAllOrders,
    apiUpdateOrderStatus,
    getOrder,
    apiCreateOfflineOrders,
    apiGetAllOfflineOrders,
};
