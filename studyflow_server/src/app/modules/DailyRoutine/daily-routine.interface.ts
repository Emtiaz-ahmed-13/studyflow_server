export interface IDailyRoutine {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
    activities: {
        slot: string; // DailyRoutineSlot
        time: string; // HH:MM
        duration: number; // minutes
        activityId?: string; // Link to specific activity
    }[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateDailyRoutine {
    name?: string;
    activities: {
        slot: string;
        time: string;
        duration: number;
        activityId?: string;
    }[];
    metadata?: Record<string, any>;
}

export interface IUpdateDailyRoutine {
    name?: string;
    isActive?: boolean;
    activities?: {
        slot: string;
        time: string;
        duration: number;
        activityId?: string;
    }[];
    metadata?: Record<string, any>;
}
