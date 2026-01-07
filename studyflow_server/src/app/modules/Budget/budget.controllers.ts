import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BudgetService } from "./budget.services";

// Budget Controllers
const createBudget = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.createBudget(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Budget created successfully", data: result });
});

const getMyBudgets = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { month, year, page, limit } = req.query;
    const result = await BudgetService.getBudgets({
        userId: req.user?.userId,
        month: month ? parseInt(month as string) : undefined,
        year: year ? parseInt(year as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });
    sendResponse(res, { statusCode: 200, success: true, message: "Budgets retrieved successfully", data: result.data, meta: result.meta });
});

const getBudgetById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.getBudgetById(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Budget retrieved successfully", data: result });
});

const updateBudget = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.updateBudget(req.params.id, req.user?.userId, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Budget updated successfully", data: result });
});

const deleteBudget = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.deleteBudget(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: result.message, data: null });
});

// Expense Controllers
const createExpense = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.createExpense(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Expense created successfully", data: result });
});

const getMyExpenses = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { budgetId, category, startDate, endDate, page, limit } = req.query;
    const result = await BudgetService.getExpenses({
        userId: req.user?.userId,
        budgetId: budgetId as string,
        category: category as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
    });
    sendResponse(res, { statusCode: 200, success: true, message: "Expenses retrieved successfully", data: result.data, meta: result.meta });
});

const getExpenseById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.getExpenseById(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Expense retrieved successfully", data: result });
});

const updateExpense = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.updateExpense(req.params.id, req.user?.userId, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Expense updated successfully", data: result });
});

const deleteExpense = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.deleteExpense(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: result.message, data: null });
});

// Income Controllers
const createIncome = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.createIncome(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Income created successfully", data: result });
});

const getMyIncomes = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { budgetId, category, startDate, endDate, page, limit } = req.query;
    const result = await BudgetService.getIncomes({
        userId: req.user?.userId,
        budgetId: budgetId as string,
        category: category as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
    });
    sendResponse(res, { statusCode: 200, success: true, message: "Incomes retrieved successfully", data: result.data, meta: result.meta });
});

const getIncomeById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.getIncomeById(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Income retrieved successfully", data: result });
});

const updateIncome = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.updateIncome(req.params.id, req.user?.userId, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Income updated successfully", data: result });
});

const deleteIncome = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await BudgetService.deleteIncome(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: result.message, data: null });
});

export const BudgetController = {
    createBudget, getMyBudgets, getBudgetById, updateBudget, deleteBudget,
    createExpense, getMyExpenses, getExpenseById, updateExpense, deleteExpense,
    createIncome, getMyIncomes, getIncomeById, updateIncome, deleteIncome,
};
