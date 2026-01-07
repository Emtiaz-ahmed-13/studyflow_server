import { MeditationType } from "@prisma/client";

export interface IMeditationSession {
    id: string;
    type: MeditationType;
    userId: string;
    duration: number; // in minutes
    stressLevelBefore?: number;
    stressLevelAfter?: number;
    notes?: string;
    completed: boolean;
    createdAt: Date;
}

export interface ICreateMeditation {
    type: MeditationType;
    duration: number;
    stressLevelBefore?: number;
    stressLevelAfter?: number;
    notes?: string;
}

export interface IWellnessActivity {
    id: string;
    userId: string;
    activityType: string;
    duration?: number;
    rating?: number;
    notes?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateWellnessActivity {
    activityType: string;
    duration?: number;
    rating?: number;
    notes?: string;
    date?: Date;
}
