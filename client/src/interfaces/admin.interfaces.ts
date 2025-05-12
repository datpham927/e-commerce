/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa kiểu dữ liệu cho admin
export interface IAdmin {
    _id?: string;
    admin_name: string;
    admin_email: string;
    admin_type: 'admin' | 'employee';
    admin_roles?: string[] | any; // ID của các roles
    roles?: string[] | any;
    admin_mobile: string;
    admin_avatar_url?: string;
    admin_password?: string;
    permissions?: string[];
}
