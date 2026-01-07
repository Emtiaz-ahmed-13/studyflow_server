"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const email_config_1 = require("../../../config/email.config");
const socket_config_1 = require("../../../config/socket.config");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
/**
 * Create a new notification
 */
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield prisma_1.default.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata || {},
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    // ✅ Emit real-time notification via Socket.IO
    try {
        const io = (0, socket_config_1.getIO)();
        io.to(`user:${data.userId}`).emit("notification:new", {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
            isRead: notification.isRead,
        });
        console.log(`📬 Real-time notification sent to user:${data.userId}`);
    }
    catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }
    return notification;
});
/**
 * Send email notification
 */
const sendEmailNotification = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn("Email credentials not configured. Skipping email send.");
            return null;
        }
        const info = yield email_config_1.emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
        });
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError_1.default(500, "Failed to send email notification");
    }
});
/**
 * Get user notifications with pagination
 */
const getUserNotifications = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, isRead, type, page = 1, limit = 20 } = filters;
    const where = { userId };
    if (isRead !== undefined) {
        where.isRead = isRead;
    }
    if (type) {
        where.type = type;
    }
    const skip = (page - 1) * limit;
    const [notifications, total] = yield Promise.all([
        prisma_1.default.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.notification.count({ where }),
    ]);
    return {
        data: notifications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
/**
 * Mark notification as read
 */
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield prisma_1.default.notification.findUnique({
        where: { id: notificationId },
    });
    if (!notification) {
        throw new ApiError_1.default(404, "Notification not found");
    }
    if (notification.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized to update this notification");
    }
    const updated = yield prisma_1.default.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
    // ✅ Emit real-time update via Socket.IO
    try {
        const io = (0, socket_config_1.getIO)();
        io.to(`user:${userId}`).emit("notification:read", {
            id: notificationId,
            isRead: true,
        });
    }
    catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }
    return updated;
});
/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
    // ✅ Emit real-time update via Socket.IO
    try {
        const io = (0, socket_config_1.getIO)();
        io.to(`user:${userId}`).emit("notification:all-read", {
            count: result.count,
        });
    }
    catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }
    return result;
});
/**
 * Delete a notification
 */
const deleteNotification = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield prisma_1.default.notification.findUnique({
        where: { id: notificationId },
    });
    if (!notification) {
        throw new ApiError_1.default(404, "Notification not found");
    }
    if (notification.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized to delete this notification");
    }
    yield prisma_1.default.notification.delete({
        where: { id: notificationId },
    });
    // ✅ Emit real-time update via Socket.IO
    try {
        const io = (0, socket_config_1.getIO)();
        io.to(`user:${userId}`).emit("notification:deleted", {
            id: notificationId,
        });
    }
    catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }
    return { message: "Notification deleted successfully" };
});
const scheduleExamReminders = () => __awaiter(void 0, void 0, void 0, function* () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    // Find exams happening tomorrow
    const upcomingExams = yield prisma_1.default.exam.findMany({
        where: {
            examDate: {
                gte: tomorrow,
                lt: dayAfterTomorrow,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    for (const exam of upcomingExams) {
        yield createNotification({
            userId: exam.userId,
            type: client_1.NotificationType.EXAM_REMINDER,
            title: `Exam Tomorrow: ${exam.title}`,
            message: `Your exam "${exam.title}" is scheduled for tomorrow at ${exam.examDate.toLocaleString()}`,
            metadata: {
                examId: exam.id,
                examDate: exam.examDate,
            },
        });
        const emailTemplate = email_config_1.emailTemplates.examReminder(exam.title, exam.examDate.toLocaleString());
        yield sendEmailNotification({
            to: exam.user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
    }
    return { notificationsSent: upcomingExams.length };
});
const checkDeadlineAlerts = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    const upcomingTasks = yield prisma_1.default.studyTask.findMany({
        where: {
            deadline: {
                gte: tomorrow,
                lt: dayAfterTomorrow,
            },
            completed: false,
        },
        include: {
            studyPlan: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    for (const task of upcomingTasks) {
        yield createNotification({
            userId: task.studyPlan.userId,
            type: client_1.NotificationType.DEADLINE_ALERT,
            title: `Deadline Tomorrow: ${task.title}`,
            message: `Your task "${task.title}" is due tomorrow at ${(_a = task.deadline) === null || _a === void 0 ? void 0 : _a.toLocaleString()}`,
            metadata: {
                taskId: task.id,
                deadline: task.deadline,
            },
        });
        // Send email notification
        const emailTemplate = email_config_1.emailTemplates.deadlineAlert(task.title, ((_b = task.deadline) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || "tomorrow");
        yield sendEmailNotification({
            to: task.studyPlan.user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
    }
    return { alertsSent: upcomingTasks.length };
});
/**
 * Send streak warning
 */
const sendStreakWarning = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            streaks: true,
        },
    });
    if (!user || !user.streaks || user.streaks.length === 0) {
        return null;
    }
    const streak = user.streaks[0]; // Get the first (and only) streak record
    const lastStudyDate = streak.lastStudyDate;
    if (!lastStudyDate) {
        return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastStudy = new Date(lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    const daysSinceLastStudy = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
    // If user hasn't studied today, send warning
    if (daysSinceLastStudy >= 1 && streak.currentStreak > 0) {
        // Create in-app notification
        yield createNotification({
            userId: user.id,
            type: client_1.NotificationType.STREAK_WARNING,
            title: "Don't Break Your Streak! 🔥",
            message: `You're on a ${streak.currentStreak}-day streak! Study today to keep it alive.`,
            metadata: {
                currentStreak: streak.currentStreak,
            },
        });
        // Send email notification
        const emailTemplate = email_config_1.emailTemplates.streakWarning(streak.currentStreak);
        yield sendEmailNotification({
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
        return { streakWarningsSent: 1 };
    }
    return { streakWarningsSent: 0 };
});
exports.NotificationService = {
    createNotification,
    sendEmailNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    scheduleExamReminders,
    checkDeadlineAlerts,
    sendStreakWarning,
};
