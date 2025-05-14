import { create } from 'zustand';

// Định nghĩa kiểu cho người dùng đang online
interface UserOnline {
    userId: string;
    socketId: string;
}

// Định nghĩa trạng thái cho việc đăng nhập và danh sách user online
interface AuthState {
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    userOnline: UserOnline[];
    email: string;
    loginUser: () => void;
    loginAdmin: () => void;
    logoutUser: () => void;
    logoutAdmin: () => void;
    setEmailToConfirm: (email: string) => void;
    setUserOnline: (users: UserOnline[]) => void;
}

// Tạo Zustand store
const useAuthStore = create<AuthState>((set) => ({
    // Lấy trạng thái login từ localStorage khi khởi tạo
    isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn') || 'false'),
    isAdminLoggedIn: JSON.parse(localStorage.getItem('isAdminLoggedIn') || 'false'),
    userOnline: [],
    email: '',
    // Đăng nhập người dùng
    loginUser: () => {
        localStorage.setItem('isUserLoggedIn', 'true');
        set({ isUserLoggedIn: true });
    },

    // Đăng nhập admin
    loginAdmin: () => {
        localStorage.setItem('isAdminLoggedIn', 'true');
        set({ isAdminLoggedIn: true });
    },

    // Đăng xuất người dùng
    logoutUser: () => {
        localStorage.removeItem('isUserLoggedIn');
        localStorage.removeItem('purchasedProducts');
        localStorage.removeItem('favoriteProducts');
        localStorage.removeItem('selectedProducts');
        localStorage.removeItem('productInCart');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userVouchers');
        localStorage.removeItem('user');
        set({ isUserLoggedIn: false });
    },

    // Đăng xuất admin
    logoutAdmin: () => {
        localStorage.removeItem('isAdminLoggedIn');
        set({ isAdminLoggedIn: false });
    },

    // Cập nhật danh sách người dùng online
    setUserOnline: (users: UserOnline[]) => {
        set({ userOnline: users });
    },
    setEmailToConfirm: (email: string) => {
        set({ email });
    },
}));

export default useAuthStore;
