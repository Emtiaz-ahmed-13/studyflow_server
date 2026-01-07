"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitChallengeValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createHabitChallengeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.nativeEnum(client_1.HabitChallengeType, {
            required_error: "Habit challenge type is required",
        }),
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().optional(),
        targetDuration: zod_1.z.number({
            required_error: "Target duration is required",
        }).min(1, "Duration must be at least 1 day"),
    }),
});
const updateHabitChallengeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        targetDuration: zod_1.z.number().min(1).optional(),
    }),
});
exports.HabitChallengeValidation = {
    createHabitChallengeZodSchema,
    updateHabitChallengeZodSchema,
};
