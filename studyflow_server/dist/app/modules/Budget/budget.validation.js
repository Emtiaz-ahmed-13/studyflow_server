"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetValidation = exports.createIncomeSchema = exports.createExpenseSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
exports.createBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }).min(1),
        totalBudget: zod_1.z.number({ required_error: "Total budget is required" }).positive(),
        month: zod_1.z.number({ required_error: "Month is required" }).int().min(1).max(12),
        year: zod_1.z.number({ required_error: "Year is required" }).int().min(2000).max(2100),
    }),
});
exports.createExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({ required_error: "Amount is required" }).positive(),
        category: zod_1.z.enum(["FOOD", "TRANSPORT", "BOOKS", "ENTERTAINMENT", "UTILITIES", "HEALTH", "OTHER"]),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().datetime().optional(),
        budgetId: zod_1.z.string().uuid().optional(),
    }),
});
exports.createIncomeSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({ required_error: "Amount is required" }).positive(),
        category: zod_1.z.enum(["SALARY", "ALLOWANCE", "SCHOLARSHIP", "FREELANCE", "OTHER"]),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().datetime().optional(),
        budgetId: zod_1.z.string().uuid().optional(),
    }),
});
exports.BudgetValidation = {
    createBudgetSchema: exports.createBudgetSchema,
    createExpenseSchema: exports.createExpenseSchema,
    createIncomeSchema: exports.createIncomeSchema,
};
