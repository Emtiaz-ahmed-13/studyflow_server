import { z } from "zod";

export const createSubjectSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
        code: z.string().optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    }),
});

export const updateSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name cannot be empty").optional(),
        code: z.string().optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    }),
});

export const SubjectValidation = {
    createSubjectSchema,
    updateSubjectSchema,
};
