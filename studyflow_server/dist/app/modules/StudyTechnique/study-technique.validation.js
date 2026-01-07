"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyTechniqueValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createStudyTechniqueZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.nativeEnum(client_1.StudyTechniqueType, {
            required_error: "Technique type is required",
        }),
        subjectId: zod_1.z.string().optional(),
        duration: zod_1.z.number({
            required_error: "Duration is required",
        }).min(1, "Duration must be at least 1 minute"),
        effectiveness: zod_1.z.number().min(1).max(5).optional(),
        confidenceLevel: zod_1.z.number().min(1).max(5).optional(),
        notes: zod_1.z.string().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
const updateStudyTechniqueZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        subjectId: zod_1.z.string().optional(),
        duration: zod_1.z.number().min(1).optional(),
        effectiveness: zod_1.z.number().min(1).max(5).optional(),
        confidenceLevel: zod_1.z.number().min(1).max(5).optional(),
        notes: zod_1.z.string().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
exports.StudyTechniqueValidation = {
    createStudyTechniqueZodSchema,
    updateStudyTechniqueZodSchema,
};
