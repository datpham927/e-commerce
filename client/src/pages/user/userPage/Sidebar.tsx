import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { noUser } from '../../../assets';
import { PATH, SIDEBAR_USER } from '../../../utils/const';
import { useActionStore } from '../../../store/actionStore';
import useUserStore from '../../../store/userStore';
import useAuthStore from '../../../store/authStore';
import PaidIcon from '@mui/icons-material/Paid';
import MyLuckyWheel from '../../../components/MyLuckyWheel';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setOpenFeatureAuth } = useActionStore();
    const { user } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const [isGameModalOpen, setGameModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        if (location.pathname === PATH.PAGE_USER && !isUserLoggedIn) {
            navigate('/');
            setOpenFeatureAuth(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <div className="flex flex-col w-full gap-4 bg-white py-3 rounded-md overflow-hidden">
            <div className="flex gap-2 items-center ml-2">
                <div className="w-11 h-11 overflow-hidden rounded-full border-[1px] border-solid border-separate">
                    <img src={user.user_avatar_url || noUser} className="w-full h-full object-cover block" />
                </div>
                <div className="flex flex-col text-xs text-secondary">
                    Tài khoản của
                    <span className="text-base font-normal text-black ">{user.user_name}</span>
                </div>
            </div>
            {/* Display user balance */}
            <div className="flex flex-col items-center text-center mx-4 justify-center py-2 px-3 bg-yellow-50 rounded-xl border border-yellow-400 shadow-sm">
                <span className="text-[14px] text-gray-900">Số dư tài khoản</span>
                <div className="flex items-center gap-1 text-blue-500 font-semibold text-sm mt-1">
                    {user.user_balance?.toLocaleString('vi-VN')} VNĐ
                    <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/paymentfe/cb78f1ca161d1694.png"
                        alt="coin"
                        className="w-5 h-5 object-contain ml-1"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center text-center mx-4 justify-center py-2 px-3 bg-blue-50 rounded-xl border border-blue-400 shadow-sm">
                <span className="text-[14px] text-gray-900">Điểm hiện có</span>
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm mt-1">
                    {user.user_reward_points?.toLocaleString('vi-VN')}
                    <PaidIcon fontSize="small" />
                </div>
                {/* Button to trigger the game selection */}
                <button className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={() => setGameModalOpen(true)}>
                    Vòng quay may mắn
                </button>
            </div>

            <ul className="w-full h-full mt-4">
                {SIDEBAR_USER.map((e) => (
                    <NavLink
                        to={e.path_name}
                        key={e.path_name}
                        className={({ isActive }) =>
                            `flex gap-4 p-2 text-sm cursor-pointer ${
                                isActive ? 'text-green-500' : 'text-gray-800' // Thêm màu xanh lá cho chữ khi chọn
                            } hover:bg-gray-200`
                        }>
                        {e.icon}
                        {e.label}
                    </NavLink>
                ))}
            </ul>

            {/* Game Modal */}
            {isGameModalOpen && <MyLuckyWheel setGameModalOpen={setGameModalOpen} />}
        </div>
    );
};
