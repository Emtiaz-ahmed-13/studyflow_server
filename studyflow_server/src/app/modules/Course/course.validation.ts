import { z } from "zod";

export const createCourseSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
        semester: z.string({ required_error: "Semester is required" }),
        year: z.number({ required_error: "Year is required" }).int().min(2000).max(2100),
        credits: z.number().int().min(1).max(10).optional(),
        instructor: z.string().optional(),
        subjectId: z.string({ required_error: "Subject ID is required" }).uuid(),
    }),
});

export const updateCourseSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        semester: z.string().optional(),
        year: z.number().int().min(2000).max(2100).optional(),
        credits: z.number().int().min(1).max(10).optional(),
        instructor: z.string().optional(),
        subjectId: z.string().uuid().optional(),
    }),
});

export const CourseValidation = {
    createCourseSchema,
    updateCourseSchema,
};
