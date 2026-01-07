import { NotificationType } from "@prisma/client";
import { emailTemplates, emailTransporter } from "../../../config/email.config";
import { getIO } from "../../../config/socket.config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import {
    ICreateNotification,
    IEmailNotification,
    INotificationFilters,
} from "./notification.interface";

/**
 * Create a new notification
 */
const createNotification = async (data: ICreateNotification) => {
    const notification = await prisma.notification.create({
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
        const io = getIO();
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
    } catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }

    return notification;
};

/**
 * Send email notification
 */
const sendEmailNotification = async (emailData: IEmailNotification) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn("Email credentials not configured. Skipping email send.");
            return null;
        }

        const info = await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Failed to send email notification");
    }
};

/**
 * Get user notifications with pagination
 */
const getUserNotifications = async (filters: INotificationFilters) => {
    const { userId, isRead, type, page = 1, limit = 20 } = filters;

    const where: any = { userId };

    if (isRead !== undefined) {
        where.isRead = isRead;
    }

    if (type) {
        where.type = type;
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.notification.count({ where }),
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
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.userId !== userId) {
        throw new ApiError(403, "Unauthorized to update this notification");
    }

    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });

    // ✅ Emit real-time update via Socket.IO
    try {
        const io = getIO();
        io.to(`user:${userId}`).emit("notification:read", {
            id: notificationId,
            isRead: true,
        });
    } catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }

    return updated;
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
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
        const io = getIO();
        io.to(`user:${userId}`).emit("notification:all-read", {
            count: result.count,
        });
    } catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }

    return result;
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.userId !== userId) {
        throw new ApiError(403, "Unauthorized to delete this notification");
    }

    await prisma.notification.delete({
        where: { id: notificationId },
    });

    // ✅ Emit real-time update via Socket.IO
    try {
        const io = getIO();
        io.to(`user:${userId}`).emit("notification:deleted", {
            id: notificationId,
        });
    } catch (error) {
        console.warn("Socket.IO not initialized, skipping real-time emit");
    }

    return { message: "Notification deleted successfully" };
};


const scheduleExamReminders = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Find exams happening tomorrow
    const upcomingExams = await prisma.exam.findMany({
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
        await createNotification({
            userId: exam.userId,
            type: NotificationType.EXAM_REMINDER,
            title: `Exam Tomorrow: ${exam.title}`,
            message: `Your exam "${exam.title}" is scheduled for tomorrow at ${exam.examDate.toLocaleString()}`,
            metadata: {
                examId: exam.id,
                examDate: exam.examDate,
            },
        });

        const emailTemplate = emailTemplates.examReminder(
            exam.title,
            exam.examDate.toLocaleString()
        );

        await sendEmailNotification({
            to: exam.user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
    }

    return { notificationsSent: upcomingExams.length };
};

const checkDeadlineAlerts = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingTasks = await prisma.studyTask.findMany({
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

        await createNotification({
            userId: task.studyPlan.userId,
            type: NotificationType.DEADLINE_ALERT,
            title: `Deadline Tomorrow: ${task.title}`,
            message: `Your task "${task.title}" is due tomorrow at ${task.deadline?.toLocaleString()}`,
            metadata: {
                taskId: task.id,
                deadline: task.deadline,
            },
        });

        // Send email notification
        const emailTemplate = emailTemplates.deadlineAlert(
            task.title,
            task.deadline?.toLocaleString() || "tomorrow"
        );

        await sendEmailNotification({
            to: task.studyPlan.user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });
    }

    return { alertsSent: upcomingTasks.length };
};

/**
 * Send streak warning
 */
const sendStreakWarning = async (userId: string) => {
    const user = await prisma.user.findUnique({
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

    const daysSinceLastStudy = Math.floor(
        (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If user hasn't studied today, send warning
    if (daysSinceLastStudy >= 1 && streak.currentStreak > 0) {
        // Create in-app notification
        await createNotification({
            userId: user.id,
            type: NotificationType.STREAK_WARNING,
            title: "Don't Break Your Streak! 🔥",
            message: `You're on a ${streak.currentStreak}-day streak! Study today to keep it alive.`,
            metadata: {
                currentStreak: streak.currentStreak,
            },
        });

        // Send email notification
        const emailTemplate = emailTemplates.streakWarning(streak.currentStreak);

        await sendEmailNotification({
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        });

        return { streakWarningsSent: 1 };
    }

    return { streakWarningsSent: 0 };
};

export const NotificationService = {
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
