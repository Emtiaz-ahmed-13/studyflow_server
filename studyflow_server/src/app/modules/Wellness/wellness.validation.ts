import { MeditationType } from "@prisma/client";
import { z } from "zod";

const createMeditationZodSchema = z.object({
    body: z.object({
        type: z.nativeEnum(MeditationType, {
            required_error: "Meditation type is required",
        }),
        duration: z.number({
            required_error: "Duration is required",
        }).min(1, "Duration must be at least 1 minute"),
        stressLevelBefore: z.number().min(1).max(10).optional(),
        stressLevelAfter: z.number().min(1).max(10).optional(),
        notes: z.string().optional(),
    }),
});

const createWellnessActivityZodSchema = z.object({
    body: z.object({
        activityType: z.string({
            required_error: "Activity type is required",
        }),
        duration: z.number().min(1).optional(),
        rating: z.number().min(1).max(10).optional(),
        notes: z.string().optional(),
        date: z.string().optional(), // ISO date string
    }),
});

export const WellnessValidation = {
    createMeditationZodSchema,
    createWellnessActivityZodSchema,
};
