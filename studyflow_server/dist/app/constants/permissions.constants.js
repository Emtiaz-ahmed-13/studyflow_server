"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceType = exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    // User Management
    Permission["MANAGE_USERS"] = "MANAGE_USERS";
    Permission["VIEW_ALL_USERS"] = "VIEW_ALL_USERS";
    Permission["DELETE_USERS"] = "DELETE_USERS";
    // Study Groups
    Permission["MANAGE_STUDY_GROUPS"] = "MANAGE_STUDY_GROUPS";
    Permission["MODERATE_STUDY_GROUPS"] = "MODERATE_STUDY_GROUPS";
    Permission["JOIN_STUDY_GROUPS"] = "JOIN_STUDY_GROUPS";
    // Notes
    Permission["MANAGE_ALL_NOTES"] = "MANAGE_ALL_NOTES";
    Permission["SHARE_NOTES"] = "SHARE_NOTES";
    Permission["VIEW_OWN_NOTES"] = "VIEW_OWN_NOTES";
    // Analytics & Reports
    Permission["VIEW_ALL_ANALYTICS"] = "VIEW_ALL_ANALYTICS";
    Permission["VIEW_OWN_ANALYTICS"] = "VIEW_OWN_ANALYTICS";
    Permission["GENERATE_REPORTS"] = "GENERATE_REPORTS";
    // Content Management
    Permission["MANAGE_SUBJECTS"] = "MANAGE_SUBJECTS";
    Permission["MANAGE_EXAMS"] = "MANAGE_EXAMS";
    Permission["GENERATE_AI_CONTENT"] = "GENERATE_AI_CONTENT";
    // System
    Permission["MANAGE_SYSTEM_SETTINGS"] = "MANAGE_SYSTEM_SETTINGS";
    Permission["VIEW_SYSTEM_LOGS"] = "VIEW_SYSTEM_LOGS";
})(Permission || (exports.Permission = Permission = {}));
const studentPermissions = [
    Permission.VIEW_OWN_NOTES,
    Permission.SHARE_NOTES,
    Permission.JOIN_STUDY_GROUPS,
    Permission.VIEW_OWN_ANALYTICS,
    Permission.MANAGE_SUBJECTS,
    Permission.MANAGE_EXAMS,
    Permission.GENERATE_AI_CONTENT,
];
exports.RolePermissions = {
    STUDENT: studentPermissions,
    MODERATOR: [
        ...studentPermissions,
        Permission.MODERATE_STUDY_GROUPS,
        Permission.MANAGE_STUDY_GROUPS,
        Permission.VIEW_ALL_ANALYTICS,
        Permission.GENERATE_REPORTS,
    ],
    ADMIN: [
        ...Object.values(Permission),
    ],
};
var ResourceType;
(function (ResourceType) {
    ResourceType["NOTE"] = "NOTE";
    ResourceType["SUBJECT"] = "SUBJECT";
    ResourceType["STUDY_PLAN"] = "STUDY_PLAN";
    ResourceType["STUDY_GROUP"] = "STUDY_GROUP";
    ResourceType["EXAM"] = "EXAM";
    ResourceType["BUDGET"] = "BUDGET";
    ResourceType["EXPENSE"] = "EXPENSE";
    ResourceType["INCOME"] = "INCOME";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
