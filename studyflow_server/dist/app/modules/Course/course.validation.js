"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }).min(1),
        semester: zod_1.z.string({ required_error: "Semester is required" }),
        year: zod_1.z.number({ required_error: "Year is required" }).int().min(2000).max(2100),
        credits: zod_1.z.number().int().min(1).max(10).optional(),
        instructor: zod_1.z.string().optional(),
        subjectId: zod_1.z.string({ required_error: "Subject ID is required" }).uuid(),
    }),
});
exports.updateCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        semester: zod_1.z.string().optional(),
        year: zod_1.z.number().int().min(2000).max(2100).optional(),
        credits: zod_1.z.number().int().min(1).max(10).optional(),
        instructor: zod_1.z.string().optional(),
        subjectId: zod_1.z.string().uuid().optional(),
    }),
});
exports.CourseValidation = {
    createCourseSchema: exports.createCourseSchema,
    updateCourseSchema: exports.updateCourseSchema,
};
