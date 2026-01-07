import { z } from "zod";

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Title is required" }).min(1),
        content: z.string({ required_error: "Content is required" }).min(1),
        tags: z.array(z.string()).optional(),
        subjectId: z.string().uuid().optional(),
    }),
});

export const updateNoteSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        subjectId: z.string().uuid().optional(),
    }),
});

export const NoteValidation = {
    createNoteSchema,
    updateNoteSchema,
};
