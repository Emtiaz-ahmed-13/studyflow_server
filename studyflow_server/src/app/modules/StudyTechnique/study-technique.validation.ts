import { StudyTechniqueType } from "@prisma/client";
import { z } from "zod";

const createStudyTechniqueZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(StudyTechniqueType, {
            required_error: "Technique type is required",
        }),
        subjectId: z.string().optional(),
        duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
        effectiveness: z.number().min(1).max(5).optional(),
        confidenceLevel: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
        metadata: z.record(z.any()).optional(),
    }),
});

const updateStudyTechniqueZodSchema = z.object({
    body: z.object({
        subjectId: z.string().optional(),
        duration: z.number().min(1).optional(),
        effectiveness: z.number().min(1).max(5).optional(),
        confidenceLevel: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
        metadata: z.record(z.any()).optional(),
    }),
});

export const StudyTechniqueValidation = {
    createStudyTechniqueZodSchema,
    updateStudyTechniqueZodSchema,
};
