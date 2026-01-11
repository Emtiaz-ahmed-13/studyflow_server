"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingMaterialValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createReadingMaterialZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        type: zod_1.z.nativeEnum(client_1.MaterialType).optional().default(client_1.MaterialType.PDF),
        content: zod_1.z.string().optional(),
        fileUrl: zod_1.z.string().url("Invalid URL").optional(), // Will be populated by controller if file uploaded
        topics: zod_1.z.array(zod_1.z.string()).optional(),
        difficulty: zod_1.z.nativeEnum(client_1.DifficultyLevel).optional(),
        metadata: zod_1.z.any().optional(),
        subjectId: zod_1.z.string().optional(),
    }),
});
exports.ReadingMaterialValidation = {
    createReadingMaterialZodSchema,
};
