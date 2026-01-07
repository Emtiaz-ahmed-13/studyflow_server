import { z } from "zod";

const loginZodSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    }),
});

const registerZodSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
    }),
});

const refreshTokenZodSchema = z.object({
    body: z.object({
        refreshToken: z.string({
            required_error: "Refresh Token is required",
        }),
    }),
});

export const AuthValidation = {
    loginZodSchema,
    registerZodSchema,
    refreshTokenZodSchema,
};
