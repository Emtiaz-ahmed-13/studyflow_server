import { DifficultyLevel, MaterialType } from "@prisma/client";
import { z } from "zod";

const createReadingMaterialZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required",
        }),
        type: z.nativeEnum(MaterialType).optional().default(MaterialType.PDF),
        content: z.string().optional(),
        fileUrl: z.string().url("Invalid URL").optional(), // Will be populated by controller if file uploaded
        topics: z.array(z.string()).optional(),
        difficulty: z.nativeEnum(DifficultyLevel).optional(),
        metadata: z.any().optional(),
        subjectId: z.string().optional(),
    }),
});

export const ReadingMaterialValidation = {
    createReadingMaterialZodSchema,
};
