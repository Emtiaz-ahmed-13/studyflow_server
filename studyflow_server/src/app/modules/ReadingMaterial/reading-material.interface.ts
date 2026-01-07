import { DifficultyLevel, MaterialType } from "@prisma/client";

export interface IReadingMaterial {
    id: string;
    title: string;
    type: MaterialType;
    content?: string | null;
    fileUrl?: string | null;
    topics: string[];
    difficulty: DifficultyLevel | null;
    summary?: string | null;
    metadata?: any | null;
    subjectId?: string | null;

    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateReadingMaterial {
    title: string;
    type?: MaterialType;
    content?: string;
    fileUrl?: string;
    topics?: string[];
    difficulty?: DifficultyLevel;
    metadata?: any;
    subjectId?: string;
}
