export const PATH = {
    HOME: '/',
    DETAIL_PRODUCT: '/:slug/:pid',
    PAGE_CATEGORY: '/danh-muc/:category_slug/:category_code',
    PAGE_LIST_CATEGORY: 'danh-sach-danh-muc',
    PAGE_BRAND: '/thuong-hieu/:brand_id',
    PAGE_SEARCH: '/tim-kiem/:keySearch',
    PAGE_IMAGE_SEARCH: '/tim-kiem-hinh-anh',
    PAGE_CART: '/gio-hang',
    PAGE_PAYMENT: '/thanh-toan',
    PAGE_PAYMENT_CONFIRM: '/xac-nhan-thanh-toan',
    VOUCHER: '/voucher',
    FORGET_PASSWORD: '/reset_password/:token',
    MESSAGE: 'message',
    PAGE_USER: '/nguoi-dung',
    PAGE_ORDER: '/nguoi-dung/don-hang',
    PAGE_PROFILE: '/nguoi-dung/thong-tin-tai-khoan',
    PAGE_FAVORITE: '/nguoi-dung/san-pham-yeu-thich',
    PAGE_RECENT_VIEW: '/nguoi-dung/da-xem-gan-day',
    PAGE_PURCHASED: '/nguoi-dung/san-pham-da-mua',
    PAGE_USER_VOUCHER: '/nguoi-dung/voucher-cua-ban',
    PAGE_REDEEM_VOUCHER: '/nguoi-dung/doi-phieu-mua-hang',
    PAGE_ORDER_DETAIL: '/nguoi-dung/chi-tiet-don-hang/:oid',
    //=============== mobile =============
    PAGE_USER_MOBILE: '/danh-muc-nguoi-dung',
    PAGE_CATEGORY_MOBILE: 'danh-muc-san-pham',
    PAGE_CHAT_MOBILE: 'chat',
    // =========== ADMIN ==============
    ADMIN_DASHBOARD: '/quan-ly',
    MANAGE_DASHBOARD: '/quan-ly/dashboard',
    ADMIN_LOGIN: '/dang-nhap',
    MANAGE_CATEGORY: '/quan-ly/danh-muc',
    MANAGE_BRAND: '/quan-ly/thuong-hieu',
    MANAGE_BANNER: '/quan-ly/banner',
    MANAGE_SUPPLIERS: '/quan-ly/nha-cung-cap',
    MANAGE_STATISTICAL: '/thong-ke-doanh-thu',
    MANAGE_VOUCHER: '/quan-ly/voucher',
    MANAGE_USER: '/quan-ly/nguoi-dung',
    MANAGE_SHIPPING: '/quan-ly/cong-ty-van-chuyen',
    MANAGE_ROLE: '/quan-ly/vai-tro',
    MANAGE_EMPLOYEE: '/quan-ly/nhan-vien',
    MANAGE_PRODUCT: '/quan-ly/san-pham',
    MANAGE_ORDER: '/quan-ly/don-hang',
    MANAGE_OFFLINE_ORDER: '/quan-ly/tao-hoa-don',
    MANAGE_LIST_OFFLINE_ORDER: '/quan-ly/hoa-don',
    ORDER_DETAIL: '/quan-ly/don-hang-chi-tiet/:oid',
    MANAGE_PROFILE: '/quan-ly/chinh-sua-thong-tin',
    MANAGE_REVIEW: '/quan-ly/danh-gia',
    MANAGE_MESSAGE: '/quan-ly/nhan-tin',
};

export const SEARCH_UTILITY = [
    {
        id: 0,
        image: danhchoban,
        title: 'Dành cho bạn',
    },
    {
        id: 1,
        image: hangmoi,
        title: 'Hàng mới',
    },
    {
        id: 2,
        image: bachhoa,
        title: 'Dưới 99k',
    },
    {
        id: 3,
        image: revodoi,
        title: 'Rẻ vô đối',
    },
];

export const RATING_REVIEW = [
    { start: 1, text: 'Rất tệ' },
    { start: 2, text: 'Tệ ' },
    { start: 3, text: 'Bình thường' },
    { start: 4, text: 'Tốt ' },
    { start: 5, text: 'Rất tốt' },
];

export const SORT_BAR = [
    {
        id: 0,
        label: 'tất cả',
        sortBy: {
            sort: '',
        },
    },
    {
        id: 1,
        label: 'Phổ biến',
        sortBy: {
            sort: '-product_ratings',
        },
    },
    {
        id: 2,
        label: 'Bán chạy',
        sortBy: {
            sort: '-product_sold',
        },
    },
    {
        id: 3,
        label: 'Giá thấp đến cao',
        sortBy: {
            sort: 'product_discounted_price',
        },
    },
    {
        id: 4,
        label: 'Giá cao đến thấp',
        sortBy: {
            sort: '-product_discounted_price',
        },
    },
];

import { bachhoa, danhchoban, hangmoi, imgPayInCash, vnpay, revodoi } from '../assets';

export const SIDEBAR_USER = [
    {
        label: 'Thông tin tài khoản',
        path_name: PATH.PAGE_PROFILE,
        icon: (
            <img
                src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                alt="Thông tin tài khoản"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} // Điều chỉnh kích thước cho phù hợp
            />
        ),
    },
    {
        label: 'Danh sách đơn hàng',
        path_name: PATH.PAGE_ORDER,
        icon: (
            <img
                src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"
                alt="Danh sách đơn hàng"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} // Điều chỉnh kích thước cho phù hợp
            />
        ),
    },
    {
        label: 'Sản phẩm đã mua',
        path_name: PATH.PAGE_PURCHASED,
        icon: (
            <img
                src="https://img.icons8.com/?size=100&id=FFL2KkPqXnIL&format=png&color=40C057"
                alt="purchased-icon"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
        ),
    },

    {
        label: 'Sản phẩm yêu thích',
        path_name: PATH.PAGE_FAVORITE,
        icon: (
            <img
                src="https://img.icons8.com/?size=100&id=CDX3UwscuB9X&format=png&color=000000"
                alt="favorite"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
        ),
    },

    {
        label: 'Đã xem gần đây',
        path_name: PATH.PAGE_RECENT_VIEW,
        icon: (
            <img
                src="https://img.icons8.com/?size=100&id=mnhMRVfDbJdQ&format=png&color=000000"
                alt="recent"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
        ),
    },

    {
        label: 'Kho voucher',
        path_name: PATH.PAGE_USER_VOUCHER,
        icon: (
            <img
                src="https://down-vn.img.susercontent.com/file/84feaa363ce325071c0a66d3c9a88748"
                alt="Kho voucher"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} // Điều chỉnh kích thước cho phù hợp
            />
        ),
    },
    {
        label: 'Đổi voucher',
        path_name: PATH.PAGE_REDEEM_VOUCHER,
        icon: (
            <img
                src="https://down-vn.img.susercontent.com/file/a0ef4bd8e16e481b4253bd0eb563f784"
                alt="Đổi voucher"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} // Điều chỉnh kích thước cho phù hợp
            />
        ),
    },
];

export const PAYMENT_METHOD = {
    title: 'Chọn hình thức thanh toán',
    method: [
        {
            code: 'CASH',
            label: 'Thanh toán tiền mặt khi nhận hàng',
            img: imgPayInCash,
        },
        {
            code: 'VNPAY',
            label: 'Thanh toán bằng VNPAY',
            img: vnpay,
        },
        {
            code: 'COIN',
            label: 'Thanh toán bằng số dư',
            img: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/paymentfe/cb78f1ca161d1694.png',
        },
    ],
};
export const DELIVERY_METHOD = {
    title: 'Chọn hình thức giao hàng',
    method: [
        {
            code: 'FAST',
            label: 'Giao tiết kiệm',
        },
        {
            code: 'NOW',
            label: 'Giao siêu tốc',
        },
    ],
};

export const SELL_TAB = [
    {
        tab: 1,
        title: 'Tất cả',
    },
    {
        tab: 2,
        title: 'Chờ xác nhận',
    },
    {
        tab: 3,
        title: 'Vận Chuyển',
    },
    {
        tab: 4,
        title: 'Đã giao hàng',
    },
    {
        tab: 5,
        title: 'Thành công',
    },
    {
        tab: 6,
        title: 'Đã hủy',
    },
];

export const BOTTOM_NAVIGATE_MOBILE = [
    {
        label: 'Trang chủ',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/home.png',
        link: PATH.HOME,
    },
    {
        label: 'Danh mục',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/cate.png',
        link: PATH.PAGE_CATEGORY_MOBILE,
    },
    {
        label: 'Chat',
        logo: 'https://salt.tikicdn.com/ts/upload/b6/cb/1d/34cbe52e6c2566c5033103c847a9d855.png',
        link: PATH.PAGE_CHAT_MOBILE,
    },
    {
        label: 'Cá nhân',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/account.png',
        link: PATH.PAGE_USER_MOBILE,
    },
];
