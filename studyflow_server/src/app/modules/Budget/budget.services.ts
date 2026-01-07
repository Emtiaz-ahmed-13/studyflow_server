import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IBudgetFilters, ICreateBudget, ICreateExpense, ICreateIncome, IExpenseFilters, IIncomeFilters, IUpdateBudget, IUpdateExpense, IUpdateIncome } from "./budget.interface";

// Budget Services
const createBudget = async (userId: string, data: ICreateBudget) => {
    const budget = await prisma.budget.create({
        data: { ...data, userId },
        include: { expenses: true, incomes: true },
    });
    return budget;
};

const getBudgets = async (filters: IBudgetFilters) => {
    const { userId, month, year, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions: any = { userId };
    if (month) whereConditions.month = month;
    if (year) whereConditions.year = year;

    const [budgets, total] = await Promise.all([
        prisma.budget.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { expenses: true, incomes: true },
            orderBy: [{ year: "desc" }, { month: "desc" }],
        }),
        prisma.budget.count({ where: whereConditions }),
    ]);

    return { data: budgets, meta: { page, limit, total } };
};

const getBudgetById = async (id: string, userId: string) => {
    const budget = await prisma.budget.findFirst({
        where: { id, userId },
        include: { expenses: true, incomes: true },
    });
    if (!budget) throw new ApiError(404, "Budget not found");
    return budget;
};

const updateBudget = async (id: string, userId: string, data: IUpdateBudget) => {
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Budget not found");
    return await prisma.budget.update({ where: { id }, data, include: { expenses: true, incomes: true } });
};

const deleteBudget = async (id: string, userId: string) => {
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Budget not found");
    await prisma.budget.delete({ where: { id } });
    return { message: "Budget deleted successfully" };
};

// Expense Services
const createExpense = async (userId: string, data: ICreateExpense) => {
    if (data.budgetId) {
        const budget = await prisma.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget) throw new ApiError(404, "Budget not found");
    }
    return await prisma.expense.create({
        data: { ...data, userId, date: data.date || new Date() },
        include: { budget: true },
    });
};

const getExpenses = async (filters: IExpenseFilters) => {
    const { userId, budgetId, category, startDate, endDate, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions: any = { userId };
    if (budgetId) whereConditions.budgetId = budgetId;
    if (category) whereConditions.category = category;
    if (startDate || endDate) {
        whereConditions.date = {};
        if (startDate) whereConditions.date.gte = startDate;
        if (endDate) whereConditions.date.lte = endDate;
    }

    const [expenses, total] = await Promise.all([
        prisma.expense.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { budget: true },
            orderBy: { date: "desc" },
        }),
        prisma.expense.count({ where: whereConditions }),
    ]);

    return { data: expenses, meta: { page, limit, total } };
};

const getExpenseById = async (id: string, userId: string) => {
    const expense = await prisma.expense.findFirst({ where: { id, userId }, include: { budget: true } });
    if (!expense) throw new ApiError(404, "Expense not found");
    return expense;
};

const updateExpense = async (id: string, userId: string, data: IUpdateExpense) => {
    const existing = await prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Expense not found");
    if (data.budgetId) {
        const budget = await prisma.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget) throw new ApiError(404, "Budget not found");
    }
    return await prisma.expense.update({ where: { id }, data, include: { budget: true } });
};

const deleteExpense = async (id: string, userId: string) => {
    const existing = await prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Expense not found");
    await prisma.expense.delete({ where: { id } });
    return { message: "Expense deleted successfully" };
};

// Income Services
const createIncome = async (userId: string, data: ICreateIncome) => {
    if (data.budgetId) {
        const budget = await prisma.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget) throw new ApiError(404, "Budget not found");
    }
    return await prisma.income.create({
        data: { ...data, userId, date: data.date || new Date() },
        include: { budget: true },
    });
};

const getIncomes = async (filters: IIncomeFilters) => {
    const { userId, budgetId, category, startDate, endDate, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions: any = { userId };
    if (budgetId) whereConditions.budgetId = budgetId;
    if (category) whereConditions.category = category;
    if (startDate || endDate) {
        whereConditions.date = {};
        if (startDate) whereConditions.date.gte = startDate;
        if (endDate) whereConditions.date.lte = endDate;
    }

    const [incomes, total] = await Promise.all([
        prisma.income.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { budget: true },
            orderBy: { date: "desc" },
        }),
        prisma.income.count({ where: whereConditions }),
    ]);

    return { data: incomes, meta: { page, limit, total } };
};

const getIncomeById = async (id: string, userId: string) => {
    const income = await prisma.income.findFirst({ where: { id, userId }, include: { budget: true } });
    if (!income) throw new ApiError(404, "Income not found");
    return income;
};

const updateIncome = async (id: string, userId: string, data: IUpdateIncome) => {
    const existing = await prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Income not found");
    if (data.budgetId) {
        const budget = await prisma.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget) throw new ApiError(404, "Budget not found");
    }
    return await prisma.income.update({ where: { id }, data, include: { budget: true } });
};

const deleteIncome = async (id: string, userId: string) => {
    const existing = await prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Income not found");
    await prisma.income.delete({ where: { id } });
    return { message: "Income deleted successfully" };
};

export const BudgetService = {
    createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget,
    createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense,
    createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome,
};
