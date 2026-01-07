"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectValidation = exports.updateSubjectSchema = exports.createSubjectSchema = void 0;
const zod_1 = require("zod");
exports.createSubjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
        code: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    }),
});
exports.updateSubjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        code: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    }),
});
exports.SubjectValidation = {
    createSubjectSchema: exports.createSubjectSchema,
    updateSubjectSchema: exports.updateSubjectSchema,
};
