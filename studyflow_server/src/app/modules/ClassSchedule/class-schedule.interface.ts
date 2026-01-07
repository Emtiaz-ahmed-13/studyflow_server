export interface IClassSchedule {
    id: string;
    title: string;
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // Format: "HH:MM"
    endTime: string; // Format: "HH:MM"
    location?: string;
    subjectId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateClassSchedule {
    title: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location?: string;
    subjectId: string;
}

export interface IUpdateClassSchedule {
    title?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    location?: string;
    subjectId?: string;
}

export interface IClassScheduleFilters {
    userId: string;
    subjectId?: string;
    dayOfWeek?: number;
    page?: number;
    limit?: number;
}
