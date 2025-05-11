import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layout/system/AppLayout';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';
import useAuthStore from '../store/authStore';
import { AdminLogin, DashboardManage } from '../pages/system';
import { ADMIN_ROUTES } from '../config/route';
import PermissionMiddleware from '../middleware/PermissionMiddleware';
import { NoPermission } from '../components';
import AdminProfile from '../pages/system/profile';
import HomePage from '../pages/user/HomePage';
import DetailPage from '../pages/user/detailPage';
import FilterPage from '../pages/user/filterPage';
import ForgotPassword from '../feature/forgotPassword';
import UserPage from '../pages/user/userPage';
import FavoritePage from '../pages/user/userPage/FavoritePage';
import RecentViewPage from '../pages/user/userPage/RecentViewPage';
import PurchasedProductsPage from '../pages/user/userPage/PurchasedProductsPage';
import OrderPage from '../pages/user/userPage/orderPage';
import UserVoucherPage from '../pages/user/userPage/UserVoucherPage';
import UserProfilePage from '../pages/user/userPage/UserProfilePage';
import RedeemVoucherPage from '../pages/user/userPage/RedeemVoucherPage';
import OrderDetailPage from '../pages/user/userPage/orderDetailPage';
import SearchPage from '../pages/user/searchPage';
import CartPage from '../pages/user/cartPage';
import VoucherPage from '../pages/user/voucherPage';
import PaymentPage from '../pages/user/PaymentPage';
import PaymentConfirmPage from '../pages/user/PaymentConfirmPage';
import MenuUserOption from '../components/mobile/MenuUserOption';
import ChatPage from '../pages/mobile/ChatPage';
import { useActionStore } from '../store/actionStore';
import CategoriesListPage from '../pages/mobile/CategoriesListPage';

const RouterPage = () => {
    const { isAdminLoggedIn, isUserLoggedIn } = useAuthStore();
    const { mobile_ui } = useActionStore();

    return (
        <Routes>
            {/* ============= USER =================== */}
            <Route path={PATH.HOME} element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path={PATH.DETAIL_PRODUCT} element={<DetailPage />} />
                <Route path={PATH.PAGE_SEARCH} element={<SearchPage />} />
                <Route path={PATH.PAGE_IMAGE_SEARCH} element={<SearchPage />} />
                <Route path={PATH.PAGE_CATEGORY} element={<FilterPage />} />
                <Route path={PATH.PAGE_BRAND} element={<FilterPage />} />
                <Route path={PATH.PAGE_CART} element={<CartPage />} />
                <Route path={PATH.FORGET_PASSWORD} element={<ForgotPassword />} />
                <Route path={PATH.VOUCHER} element={<VoucherPage />} />
                <Route path={PATH.PAGE_PAYMENT} element={<PaymentPage />}></Route>
                <Route path={PATH.PAGE_PAYMENT_CONFIRM} element={<PaymentConfirmPage />} />
                {/* Các trang bên dưới vẫn được bọc trong DefaultLayout */}
                {/* <Route path="*" element={<Navigate to={PATH.HOME} />} /> */}
                <Route path={PATH.PAGE_USER} element={isUserLoggedIn ? <UserPage /> : <Navigate to="/" />}>
                    <Route path={''} element={<Navigate to={PATH.PAGE_PROFILE} />} />
                    <Route path={PATH.PAGE_PROFILE} element={<UserProfilePage />} />
                    <Route path={PATH.PAGE_FAVORITE} element={<FavoritePage />} />
                    <Route path={PATH.PAGE_RECENT_VIEW} element={<RecentViewPage />} />
                    <Route path={PATH.PAGE_PURCHASED} element={<PurchasedProductsPage />} />
                    <Route path={PATH.PAGE_ORDER} element={<OrderPage />} />
                    <Route path={PATH.PAGE_USER_VOUCHER} element={<UserVoucherPage />} />
                    <Route path={PATH.PAGE_REDEEM_VOUCHER} element={<RedeemVoucherPage />} />
                    <Route path={PATH.PAGE_ORDER_DETAIL} element={<OrderDetailPage />} />
                </Route>
                {mobile_ui && (
                    <>
                        <Route path={PATH.PAGE_CHAT_MOBILE} element={<ChatPage />} />
                        <Route path={PATH.PAGE_USER_MOBILE} element={isUserLoggedIn ? <MenuUserOption /> : <Navigate to="/" />} />
                        <Route path={PATH.PAGE_CATEGORY_MOBILE} element={<CategoriesListPage />} />
                    </>
                )}
            </Route>

            {/* Đặc biệt: không bọc UserProfile trong DefaultLayout */}

            {/* ============= ADMIN =================== */}
            <Route
                path={PATH.ADMIN_DASHBOARD}
                element={
                    <ProtectedRoute redirectPath={PATH.ADMIN_LOGIN}>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                {/* Route mặc định */}
                <Route index element={<DashboardManage />} />
                <Route path={PATH.MANAGE_DASHBOARD} element={<DashboardManage />} />
                {/* Lặp qua các route có phân quyền */}
                {ADMIN_ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <PermissionMiddleware requiredPermissions={route.permissions} redirectNode={<NoPermission />}>
                                <route.component />
                            </PermissionMiddleware>
                        }
                    />
                ))}
                {/* Nếu không khớp route nào, điều hướng về dashboard */}
                <Route path={PATH.MANAGE_PROFILE} element={<AdminProfile />} />
                <Route path="*" element={<Navigate to={PATH.MANAGE_DASHBOARD} />} />
            </Route>
            <Route path="*" element={<Navigate to={PATH.HOME} />} />
            {/* Trang đăng nhập admin */}
            <Route path={PATH.ADMIN_LOGIN} element={isAdminLoggedIn ? <Navigate to={PATH.ADMIN_DASHBOARD} /> : <AdminLogin />} />
        </Routes>
    );
};

export default RouterPage;
