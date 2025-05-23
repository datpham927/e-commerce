/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Sidebar } from '../../pages/user/userPage/Sidebar';
import { Link } from 'react-router-dom';
import { apiLogout } from '../../services/auth.user.service';
import useAuthStore from '../../store/authStore';
import { ButtonOutline } from '..';
import Cart from '../cart';
import { useActionStore } from '../../store/actionStore';

const MenuUserOption: React.FC = () => {
    const { logoutUser, isUserLoggedIn } = useAuthStore();
    const { setOpenFeatureAuth } = useActionStore();

    const handleLogOut = async () => {
        if (confirm('Bạn có muốn đăng xuất')) {
            const res = await apiLogout();
            if (!res.success) return;
            logoutUser();
        }
    };
    useEffect(() => {
        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
        }
    }, [isUserLoggedIn]);
    return (
        <div className="fixed-mobile bg-white">
            <div className="flex justify-between items-center text-white py-2 bg-primary px-2">
                <Link to={'/'}>
                    <ChevronLeftIcon fontSize="large" />
                </Link>
                <p className="text-base">Quản lý tài khoản</p>
                <Cart />
            </div>
            <Sidebar />
            <ButtonOutline onClick={handleLogOut} className="bg-primary text-white mx-auto">
                Đăng xuất
            </ButtonOutline>
        </div>
    );
};

export default MenuUserOption;
