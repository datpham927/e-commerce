import { axiosJWT, httpRequest } from '../utils/httpRequest';

// Xác thực email khi đăng ký
const apiSendVerificationEmail = async (email: string) => {
    try {
        const res = await axiosJWT.post('/v1/api/auth/email/send-verification', { email });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xác nhận email sau khi gửi mã
const apiConfirmVerificationEmail = async (email: string, token: string) => {
    try {
        const res = await axiosJWT.put('/v1/api/auth/email/verify', { email, token });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Đăng ký người dùng
const apiRegister = async (email: string, password: string) => {
    try {
        const res = await axiosJWT.post('/v1/api/auth/signup', { email, password });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Đăng nhập người dùng
const apiLogin = async (email: string, password: string) => {
    try {
        const res = await axiosJWT.post('/v1/api/auth/login', { email, password });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Gửi email quên mật khẩu
const sendForgotPasswordEmail = async (body: object) => {
    try {
        const res = await httpRequest.post('/v1/api/auth/email/send-forgot-password', body);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xác minh mã reset mật khẩu
const verifyResetPasswordCode = async (resetCode: string) => {
    try {
        const res = await httpRequest.post('/v1/api/auth/verify-reset-password', { resetCode });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Đặt lại mật khẩu mới
const resetPassword = async (resetCode: string, newPassword: string) => {
    try {
        const res = await axiosJWT.put(`/v1/api/auth/reset-password`, { resetCode, newPassword });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Đăng xuất người dùng
const apiLogout = async () => {
    try {
        const res = await axiosJWT.post('/v1/api/auth/logout');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy refresh token
const apiRefreshToken = async () => {
    try {
        const res = await axiosJWT.post('/v1/api/auth/refreshToken', { withCredentials: true });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Đổi mật khẩu
const apiChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const res = await axiosJWT.put('/v1/api/auth/change-password', { oldPassword, newPassword });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiSendVerificationEmail,
    apiConfirmVerificationEmail,
    apiRegister,
    apiLogin,
    sendForgotPasswordEmail,
    verifyResetPasswordCode,
    resetPassword,
    apiLogout,
    apiRefreshToken,
    apiChangePassword
};
