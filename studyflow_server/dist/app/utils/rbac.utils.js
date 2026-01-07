"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolePermissions = exports.isModeratorOrAdmin = exports.isAdmin = exports.isOwnerOrAdmin = exports.canAccessResource = exports.hasAllPermissions = exports.hasAnyPermission = exports.hasPermission = void 0;
const permissions_constants_1 = require("../constants/permissions.constants");
const hasPermission = (userRole, requiredPermission) => {
    const rolePermissions = permissions_constants_1.RolePermissions[userRole] || [];
    return rolePermissions.includes(requiredPermission);
};
exports.hasPermission = hasPermission;
const hasAnyPermission = (userRole, requiredPermissions) => {
    return requiredPermissions.some((permission) => (0, exports.hasPermission)(userRole, permission));
};
exports.hasAnyPermission = hasAnyPermission;
const hasAllPermissions = (userRole, requiredPermissions) => {
    return requiredPermissions.every((permission) => (0, exports.hasPermission)(userRole, permission));
};
exports.hasAllPermissions = hasAllPermissions;
const canAccessResource = (userId, resourceOwnerId, userRole, requiredPermission) => {
    if (userId === resourceOwnerId) {
        return true;
    }
    return (0, exports.hasPermission)(userRole, requiredPermission);
};
exports.canAccessResource = canAccessResource;
const isOwnerOrAdmin = (userId, resourceOwnerId, userRole) => {
    return userId === resourceOwnerId || userRole === "ADMIN";
};
exports.isOwnerOrAdmin = isOwnerOrAdmin;
const isAdmin = (userRole) => {
    return userRole === "ADMIN";
};
exports.isAdmin = isAdmin;
const isModeratorOrAdmin = (userRole) => {
    return userRole === "MODERATOR" || userRole === "ADMIN";
};
exports.isModeratorOrAdmin = isModeratorOrAdmin;
const getRolePermissions = (userRole) => {
    return permissions_constants_1.RolePermissions[userRole] || [];
};
exports.getRolePermissions = getRolePermissions;
