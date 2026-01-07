import { DifficultyLevel } from "@prisma/client";

export interface IExam {
    id: string;
    title: string;
    description?: string;
    examDate: Date;
    duration?: number;
    subjectId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateExam {
    title: string;
    description?: string;
    examDate: Date;
    duration?: number;
    subjectId?: string;
}

export interface IUpdateExam {
    title?: string;
    description?: string;
    examDate?: Date;
    duration?: number;
    subjectId?: string;
}

export interface IExamFilters {
    userId: string;
    subjectId?: string;
    upcoming?: boolean;
    page?: number;
    limit?: number;
}

export interface IQuestion {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer?: string;
    difficulty?: DifficultyLevel;
    aiGenerated: boolean;
    examId: string;
}

export interface ICreateQuestion {
    questionText: string;
    options: string[];
    correctAnswer?: string;
    difficulty?: DifficultyLevel;
    examId: string;
}
