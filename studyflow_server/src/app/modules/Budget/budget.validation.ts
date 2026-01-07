import { z } from "zod";

export const createBudgetSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
        totalBudget: z.number({ required_error: "Total budget is required" }).positive(),
        month: z.number({ required_error: "Month is required" }).int().min(1).max(12),
        year: z.number({ required_error: "Year is required" }).int().min(2000).max(2100),
    }),
});

export const createExpenseSchema = z.object({
    body: z.object({
        amount: z.number({ required_error: "Amount is required" }).positive(),
        category: z.enum(["FOOD", "TRANSPORT", "BOOKS", "ENTERTAINMENT", "UTILITIES", "HEALTH", "OTHER"]),
        description: z.string().optional(),
        date: z.string().datetime().optional(),
        budgetId: z.string().uuid().optional(),
    }),
});

export const createIncomeSchema = z.object({
    body: z.object({
        amount: z.number({ required_error: "Amount is required" }).positive(),
        category: z.enum(["SALARY", "ALLOWANCE", "SCHOLARSHIP", "FREELANCE", "OTHER"]),
        description: z.string().optional(),
        date: z.string().datetime().optional(),
        budgetId: z.string().uuid().optional(),
    }),
});

export const BudgetValidation = {
    createBudgetSchema,
    createExpenseSchema,
    createIncomeSchema,
};
