
export enum Permission {
    // User Management
    MANAGE_USERS = "MANAGE_USERS",
    VIEW_ALL_USERS = "VIEW_ALL_USERS",
    DELETE_USERS = "DELETE_USERS",

    // Study Groups
    MANAGE_STUDY_GROUPS = "MANAGE_STUDY_GROUPS",
    MODERATE_STUDY_GROUPS = "MODERATE_STUDY_GROUPS",
    JOIN_STUDY_GROUPS = "JOIN_STUDY_GROUPS",

    // Notes
    MANAGE_ALL_NOTES = "MANAGE_ALL_NOTES",
    SHARE_NOTES = "SHARE_NOTES",
    VIEW_OWN_NOTES = "VIEW_OWN_NOTES",

    // Analytics & Reports
    VIEW_ALL_ANALYTICS = "VIEW_ALL_ANALYTICS",
    VIEW_OWN_ANALYTICS = "VIEW_OWN_ANALYTICS",
    GENERATE_REPORTS = "GENERATE_REPORTS",

    // Content Management
    MANAGE_SUBJECTS = "MANAGE_SUBJECTS",
    MANAGE_EXAMS = "MANAGE_EXAMS",
    GENERATE_AI_CONTENT = "GENERATE_AI_CONTENT",

    // System
    MANAGE_SYSTEM_SETTINGS = "MANAGE_SYSTEM_SETTINGS",
    VIEW_SYSTEM_LOGS = "VIEW_SYSTEM_LOGS",
}

const studentPermissions: Permission[] = [
    Permission.VIEW_OWN_NOTES,
    Permission.SHARE_NOTES,
    Permission.JOIN_STUDY_GROUPS,
    Permission.VIEW_OWN_ANALYTICS,
    Permission.MANAGE_SUBJECTS,
    Permission.MANAGE_EXAMS,
    Permission.GENERATE_AI_CONTENT,
];
export const RolePermissions: Record<string, Permission[]> = {
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


export enum ResourceType {
    NOTE = "NOTE",
    SUBJECT = "SUBJECT",
    STUDY_PLAN = "STUDY_PLAN",
    STUDY_GROUP = "STUDY_GROUP",
    EXAM = "EXAM",
    BUDGET = "BUDGET",
    EXPENSE = "EXPENSE",
    INCOME = "INCOME",
}
