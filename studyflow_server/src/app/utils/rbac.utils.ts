import { Permission, RolePermissions } from "../constants/permissions.constants";

export const hasPermission = (
    userRole: string,
    requiredPermission: Permission
): boolean => {
    const rolePermissions = RolePermissions[userRole] || [];
    return rolePermissions.includes(requiredPermission);
};


export const hasAnyPermission = (
    userRole: string,
    requiredPermissions: Permission[]
): boolean => {
    return requiredPermissions.some((permission) =>
        hasPermission(userRole, permission)
    );
};


export const hasAllPermissions = (
    userRole: string,
    requiredPermissions: Permission[]
): boolean => {
    return requiredPermissions.every((permission) =>
        hasPermission(userRole, permission)
    );
};

export const canAccessResource = (
    userId: string,
    resourceOwnerId: string,
    userRole: string,
    requiredPermission: Permission
): boolean => {

    if (userId === resourceOwnerId) {
        return true;
    }

    return hasPermission(userRole, requiredPermission);
};


export const isOwnerOrAdmin = (
    userId: string,
    resourceOwnerId: string,
    userRole: string
): boolean => {
    return userId === resourceOwnerId || userRole === "ADMIN";
};


export const isAdmin = (userRole: string): boolean => {
    return userRole === "ADMIN";
};


export const isModeratorOrAdmin = (userRole: string): boolean => {
    return userRole === "MODERATOR" || userRole === "ADMIN";
};


export const getRolePermissions = (userRole: string): Permission[] => {
    return RolePermissions[userRole] || [];
};
