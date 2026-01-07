import { NotificationType } from "@prisma/client";

export interface INotification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
}

export interface ICreateNotification {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
}

export interface IEmailNotification {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface INotificationFilters {
    userId: string;
    isRead?: boolean;
    type?: NotificationType;
    page?: number;
    limit?: number;
}
