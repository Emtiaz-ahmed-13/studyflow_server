import { HabitChallengeType } from "@prisma/client";
import { z } from "zod";

const createHabitChallengeZodSchema = z.object({
    body: z.object({
        type: z.nativeEnum(HabitChallengeType, {
            required_error: "Habit challenge type is required",
        }),
        title: z.string({
            required_error: "Title is required",
        }),
        description: z.string().optional(),
        startDate: z.string().optional(),
        targetDuration: z.number({
            required_error: "Target duration is required",
        }).min(1, "Duration must be at least 1 day"),
    }),
});

const updateHabitChallengeZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        targetDuration: z.number().min(1).optional(),
    }),
});

export const HabitChallengeValidation = {
    createHabitChallengeZodSchema,
    updateHabitChallengeZodSchema,
};
