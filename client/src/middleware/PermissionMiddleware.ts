import React from 'react';
import useAdminStore from '../store/adminStore';

interface PermissionMiddlewareProps {
    requiredPermissions: string;
    children: React.ReactNode;
    redirectNode: React.ReactNode;
}

const PermissionMiddleware: React.FC<PermissionMiddlewareProps> = ({ requiredPermissions, children, redirectNode }) => {
    const { admin } = useAdminStore();
    const hasPermission = admin?.admin_type === 'admin' || admin?.permissions?.includes(requiredPermissions);
    // Nếu không có quyền, không render gì cả
    if (!hasPermission) return redirectNode;
    return children;
};

export default PermissionMiddleware;
