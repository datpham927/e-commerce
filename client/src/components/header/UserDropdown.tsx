import { useState } from 'react';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useNavigate } from 'react-router';
import { Dropdown } from '../ui/dropdown/Dropdown';
import useAdminStore from '../../store/adminStore';
import { LogoAdmin } from '../../assets';
import useAuthStore from '../../store/authStore';
import { PATH } from '../../utils/const';
import { apiLogoutAdmin } from '../../services/auth.admin.service';

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { admin } = useAdminStore();
    const { logoutAdmin } = useAuthStore();
    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const handleLogout = async () => {
        const res = await apiLogoutAdmin();
        if (!res.success) return;
        logoutAdmin();
        navigate(PATH.ADMIN_LOGIN);
    };
    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400">
                <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
                    <img src={admin?.admin_avatar_url || LogoAdmin} alt={admin?.admin_type} />
                </span>

                <span className="block mr-1 font-medium text-theme-sm">{admin?.admin_name}</span>
                <svg
                    className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
                <div>
                    <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">{admin?.admin_email}</span>
                </div>

                <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            to={PATH.MANAGE_PROFILE}
                            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            <img src="https://img.icons8.com/?size=100&id=23293&format=png&color=000000" alt="edit icon" className="w-9 h-9" />
                            Chỉnh sửa hồ sơ
                        </DropdownItem>
                    </li>
                </ul>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                    <img src="https://img.icons8.com/?size=100&id=13925&format=png&color=000000" alt="logout icon" className="w-7 h-7" />
                    Đăng xuất
                </button>
            </Dropdown>
        </div>
    );
}
