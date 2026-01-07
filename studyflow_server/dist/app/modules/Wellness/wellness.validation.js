"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WellnessValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createMeditationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.nativeEnum(client_1.MeditationType, {
            required_error: "Meditation type is required",
        }),
        duration: zod_1.z.number({
            required_error: "Duration is required",
        }).min(1, "Duration must be at least 1 minute"),
        stressLevelBefore: zod_1.z.number().min(1).max(10).optional(),
        stressLevelAfter: zod_1.z.number().min(1).max(10).optional(),
        notes: zod_1.z.string().optional(),
    }),
});
const createWellnessActivityZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        activityType: zod_1.z.string({
            required_error: "Activity type is required",
        }),
        duration: zod_1.z.number().min(1).optional(),
        rating: zod_1.z.number().min(1).max(10).optional(),
        notes: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(), // ISO date string
    }),
});
exports.WellnessValidation = {
    createMeditationZodSchema,
    createWellnessActivityZodSchema,
};
