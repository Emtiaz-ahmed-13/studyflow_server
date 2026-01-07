"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRoutineValidation = void 0;
const zod_1 = require("zod");
const activitySchema = zod_1.z.object({
    slot: zod_1.z.string({
        required_error: "Slot type is required",
    }),
    time: zod_1.z.string({
        required_error: "Time is required",
    }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
    duration: zod_1.z.number({
        required_error: "Duration is required",
    }).min(1),
    activityId: zod_1.z.string().optional(),
});
const createDailyRoutineZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        activities: zod_1.z.array(activitySchema, {
            required_error: "Activities are required",
        }).min(1, "At least one activity is required"),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
const updateDailyRoutineZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        activities: zod_1.z.array(activitySchema).min(1).optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
exports.DailyRoutineValidation = {
    createDailyRoutineZodSchema,
    updateDailyRoutineZodSchema,
};
