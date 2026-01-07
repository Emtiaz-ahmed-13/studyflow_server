import { z } from "zod";

const activitySchema = z.object({
    slot: z.string({
        required_error: "Slot type is required",
    }),
    time: z.string({
        required_error: "Time is required",
    }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
    duration: z.number({
        required_error: "Duration is required",
    }).min(1),
    activityId: z.string().optional(),
});

const createDailyRoutineZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        activities: z.array(activitySchema, {
            required_error: "Activities are required",
        }).min(1, "At least one activity is required"),
        metadata: z.record(z.any()).optional(),
    }),
});

const updateDailyRoutineZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        isActive: z.boolean().optional(),
        activities: z.array(activitySchema).min(1).optional(),
        metadata: z.record(z.any()).optional(),
    }),
});

export const DailyRoutineValidation = {
    createDailyRoutineZodSchema,
    updateDailyRoutineZodSchema,
};
