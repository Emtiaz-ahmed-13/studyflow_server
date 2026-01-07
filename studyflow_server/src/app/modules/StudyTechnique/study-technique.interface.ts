import { StudyTechniqueType } from "@prisma/client";

export interface IStudyTechnique {
    id: string;
    type: StudyTechniqueType;
    userId: string;
    subjectId?: string;
    name: string;
    description?: string | null;
    duration?: number | null; // in minutes
    effectiveness?: number | null; // 1-5 rating
    confidenceLevel?: number | null; // 1-5 rating
    notes?: string | null;
    metadata?: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateStudyTechnique {
    name?: string;
    description?: string;
    type: StudyTechniqueType;
    subjectId?: string;
    duration?: number;
    effectiveness?: number;
    confidenceLevel?: number;
    notes?: string;
    metadata?: Record<string, any>;
}

export interface IUpdateStudyTechnique {
    name?: string;
    description?: string;
    subjectId?: string;
    duration?: number;
    effectiveness?: number;
    confidenceLevel?: number;
    notes?: string;
    metadata?: Record<string, any>;
}
