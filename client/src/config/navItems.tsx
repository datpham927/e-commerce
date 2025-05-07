
import { PATH } from '../utils/const';

export type NavItem = {
    name: string;
    icon: React.ReactNode; // Đổi từ React.ReactNode sang React.ElementType
    path?: string;
    permission?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
    {
        name: 'Tổng quan',
        icon: <img src="https://img.icons8.com/?size=100&id=7kZSmEyroNI0&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        path: PATH.MANAGE_DASHBOARD,
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=hSUoULMc0FvV&format=png&color=000000" alt="icon" className="w-8 h-8" />,
        name: 'Sản phẩm',
        path: PATH.MANAGE_PRODUCT,
        permission: 'product_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=44039&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Đơn hàng',
        path: PATH.MANAGE_ORDER,
        permission: 'order_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=48785&format=png&color=40C057" alt="icon" className="w-8 h-8" />,
        name: 'Bán hàng tại quầy',
        path: PATH.MANAGE_OFFLINE_ORDER,
        subItems: [
            { name: 'Tạo hóa đơn', path: PATH.MANAGE_OFFLINE_ORDER },
            { name: 'Danh sách hóa đơn', path: PATH.MANAGE_LIST_OFFLINE_ORDER },
        ],
        permission: 'offline_order',
    },
    
    {
        icon: <img src="https://img.icons8.com/?size=100&id=zKZc2LIdmO4A&format=png&color=000000" alt="icon" className="w-8 h-8" />,
        name: 'Banner',
        path: PATH.MANAGE_BANNER,
        permission: 'banner_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=DMtzOOKSkTVM&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Danh mục',
        path: PATH.MANAGE_CATEGORY,
        permission: 'category_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=mRsOVYz7mJSy&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Thương hiệu',
        path: PATH.MANAGE_BRAND,
        permission: 'brand_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=12165&format=png&color=000000" alt="icon" className="w-8 h-8" />,
        name: 'Nhà cung cấp',
        path: PATH.MANAGE_SUPPLIERS,
        permission: 'supplier_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=YKeC7BHJbT3U&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Công ty vận chuyển',
        path: PATH.MANAGE_SHIPPING,
        permission: 'shipping_company_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=DRyDxSR9Q7aS&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Voucher',
        path: PATH.MANAGE_VOUCHER,
        permission: 'voucher_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=108639&format=png&color=000000" alt="icon" className="w-10 h-10" />,
        name: 'Người dùng',
        path: PATH.MANAGE_USER,
        permission: 'voucher_manage',
    },
    {
        name: 'Nhân viên',
        icon: <img src="https://img.icons8.com/?size=100&id=110285&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        subItems: [
            { name: 'Danh sách nhân viên', path: PATH.MANAGE_EMPLOYEE },
            { name: 'Quản lý vai trò', path: PATH.MANAGE_ROLE },
        ],
        permission: 'employee_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=13823&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Đánh giá',
        path: PATH.MANAGE_REVIEW,
        permission: 'review_manage',
    },
    {
        icon: <img src="https://img.icons8.com/?size=100&id=18633&format=png&color=000000" alt="icon" className="w-9 h-9" />,
        name: 'Nhắn tin',
        path: PATH.MANAGE_MESSAGE,
        permission: 'message_manage',
    },
];