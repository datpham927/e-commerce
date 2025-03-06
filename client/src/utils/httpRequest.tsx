import axios from 'axios';

// Thiết lập baseURL cho httpRequest
export const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL_BACKEND || 'http://localhost:4000', // Đảm bảo baseURL đúng
});

// Thiết lập axiosJWT với withCredentials cho cookie
export const axiosJWT = axios.create({
    withCredentials: true, // Đảm bảo trình duyệt gửi cookie (nếu có)
    baseURL: import.meta.env.VITE_REACT_API_URL_BACKEND || 'http://localhost:4000', // Đảm bảo baseURL đúng
});

// Interceptor cho axiosJWT để thêm Authorization header với access token
axiosJWT.interceptors.request.use(
    function (config) {
        // Lấy access token từ localStorage
        const access_token = localStorage.getItem("access_token");

        // Nếu có access_token, thêm vào header Authorization
        if (access_token) {
            config.headers.Authorization = `Bearer ${JSON.parse(access_token)}`;  // Thêm Bearer trước token
        }

        return config;
    },
    function (error) {
        // Nếu có lỗi xảy ra khi gọi API, trả lỗi
        return Promise.reject(error);
    },
);
