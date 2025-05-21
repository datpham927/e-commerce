const PERMISSIONS = {
    DASHBOARD_MANAGE: 'dashboard_manage',
    BANNER_MANAGE: 'banner_manage', // Quản lý banner của người dùng
    BRAND_MANAGE: 'brand_manage', // Quản lý thương hiệu của người dùng
    CATEGORY_MANAGE: 'category_manage', // Quản lý danh mục sản phẩm
    MESSAGE_MANAGE: 'message_manage', // Quản lý tin nhắn
    ORDER_MANAGE: 'order_manage', // Quản lý đơn hàng
    MANAGE_OFFLINE_ORDER: 'offline_order', // Quản lý bán hàng tại quầy
    PRODUCT_MANAGE: 'product_manage', // Quản lý sản phẩm
    REVIEW_MANAGE: 'review_manage', // Quản lý đánh giá sản phẩm (Duyệt, xóa)
    REVIEW_VIEW_ALL: 'review_view_all', // ✅ Mới: Xem tất cả đánh giá (Admin)
    VOUCHER_MANAGE: 'voucher_manage', // Quản lý mã giảm giá
    USER_MANAGE: 'user_manage', // Quản lý người dùng
    EMPLOYEE_MANAGE: 'employee_manage', // Quản lý người dùng
    ROLE_MANAGE: 'role_manage', // Quản lý vai trò và phân quyền
    VIEW_REPORTS: 'view_reports', // Xem báo cáo thống kê
    SHIPPING_COMPANY_MANAGE: 'shipping_company_manage', // Quản lý công ty vận chuyển
    SUPPLIER_COMPANY_MANAGE: 'supplier_manage', // Quản lý nhà cung cấp
};

module.exports = PERMISSIONS;
