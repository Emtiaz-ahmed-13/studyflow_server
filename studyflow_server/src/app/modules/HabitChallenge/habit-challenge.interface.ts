import { HabitChallengeType } from "@prisma/client";

export interface IHabitChallenge {
    id: string;
    userId: string;
    type: HabitChallengeType;
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    targetDuration: number;
    progress: number;
    currentStreak: number;
    longestStreak: number;
    isCompleted: boolean;
    checkIns?: string[]; // ISO date strings
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateHabitChallenge {
    type: HabitChallengeType;
    title: string;
    description?: string;
    startDate?: Date; // Defaults to now
    targetDuration: number; // e.g. 21
}

export interface IUpdateHabitChallenge {
    title?: string;
    description?: string;
    targetDuration?: number;
}
