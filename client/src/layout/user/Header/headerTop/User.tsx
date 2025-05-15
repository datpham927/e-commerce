import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showNotification } from '../../../../components';
import useAuthStore from '../../../../store/authStore';
import { noUser } from '../../../../assets';
import useUserStore from '../../../../store/userStore';
import { PATH } from '../../../../utils/const';
import { useActionStore } from '../../../../store/actionStore';
import { apiLogout } from '../../../../services/auth.user.service';
const User: React.FC = () => {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

    const { user } = useUserStore();
    const { isUserLoggedIn, logoutUser } = useAuthStore();
    const { setOpenFeatureAuth } = useActionStore();
    const { setIsLoading } = useActionStore();

    const handleLogOut = async () => {
        if (confirm('Bạn có muốn đăng xuất')) {
            setIsLoading(true);
            const res = await apiLogout();
            if (!res.success) return;
            setIsOpenMenu(false);
            logoutUser();
            setIsLoading(false);
            showNotification('Đăng xuất thành công', true);
        }
    };
    return (
        <>
            {isUserLoggedIn ? (
                <div className="relative flex items-center" onMouseEnter={() => setIsOpenMenu(true)} onMouseLeave={() => setIsOpenMenu(false)}>
                    <span className="flex items-center shrink-0 cursor-pointer">
                        <img className="w-6 h-6 object-cover rounded-full" src={user.user_avatar_url || noUser} />
                    </span>
                    <div className="tablet:hidden text-sm font-normal text-white cursor-pointer ml-2 mr-4">
                        <span>{user.user_name}</span>
                    </div>
                    {/* menu */}
                    {isOpenMenu && (
                        <div
                            className="absolute z-[1000] flex flex-col top-[calc(100%+10px)] right-1/2 w-menu_user bg-white py-3 text-black rounded-xl
                        shadow-search after:border-[10px]  after:border-transparent after:border-b-white
                        after:top-[-20px]  after:right-5 after:absolute">
                            <Link to={PATH.PAGE_PROFILE} className="menu-user">
                                Thông tin tài khoản
                            </Link>
                            <Link to={PATH.PAGE_ORDER} className="menu-user">
                                Quản lý đơn hàng
                            </Link>
                            <Link to={PATH.PAGE_FAVORITE} className="menu-user">
                                Sản phẩm yêu thích
                            </Link>
                            <span onClick={handleLogOut} className="menu-user">
                                Đăng xuất
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center">
                    <div className="flex flex-col mx-1 cursor-pointer" onClick={() => setOpenFeatureAuth(true)}>
                        <img className="laptop:hidden w-5 h-5 rounded-full" src={noUser} />
                        <div className="tablet:hidden text-sm font-normal text-white">
                            <span>Đăng nhập</span> / <span>Đăng ký</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default User;
