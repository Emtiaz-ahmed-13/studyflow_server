"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
// Budget Services
const createBudget = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const budget = yield prisma_1.default.budget.create({
        data: Object.assign(Object.assign({}, data), { userId }),
        include: { expenses: true, incomes: true },
    });
    return budget;
});
const getBudgets = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, month, year, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (month)
        whereConditions.month = month;
    if (year)
        whereConditions.year = year;
    const [budgets, total] = yield Promise.all([
        prisma_1.default.budget.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { expenses: true, incomes: true },
            orderBy: [{ year: "desc" }, { month: "desc" }],
        }),
        prisma_1.default.budget.count({ where: whereConditions }),
    ]);
    return { data: budgets, meta: { page, limit, total } };
});
const getBudgetById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const budget = yield prisma_1.default.budget.findFirst({
        where: { id, userId },
        include: { expenses: true, incomes: true },
    });
    if (!budget)
        throw new ApiError_1.default(404, "Budget not found");
    return budget;
});
const updateBudget = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.budget.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Budget not found");
    return yield prisma_1.default.budget.update({ where: { id }, data, include: { expenses: true, incomes: true } });
});
const deleteBudget = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.budget.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Budget not found");
    yield prisma_1.default.budget.delete({ where: { id } });
    return { message: "Budget deleted successfully" };
});
// Expense Services
const createExpense = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.budgetId) {
        const budget = yield prisma_1.default.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget)
            throw new ApiError_1.default(404, "Budget not found");
    }
    return yield prisma_1.default.expense.create({
        data: Object.assign(Object.assign({}, data), { userId, date: data.date || new Date() }),
        include: { budget: true },
    });
});
const getExpenses = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, budgetId, category, startDate, endDate, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (budgetId)
        whereConditions.budgetId = budgetId;
    if (category)
        whereConditions.category = category;
    if (startDate || endDate) {
        whereConditions.date = {};
        if (startDate)
            whereConditions.date.gte = startDate;
        if (endDate)
            whereConditions.date.lte = endDate;
    }
    const [expenses, total] = yield Promise.all([
        prisma_1.default.expense.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { budget: true },
            orderBy: { date: "desc" },
        }),
        prisma_1.default.expense.count({ where: whereConditions }),
    ]);
    return { data: expenses, meta: { page, limit, total } };
});
const getExpenseById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expense = yield prisma_1.default.expense.findFirst({ where: { id, userId }, include: { budget: true } });
    if (!expense)
        throw new ApiError_1.default(404, "Expense not found");
    return expense;
});
const updateExpense = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.expense.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Expense not found");
    if (data.budgetId) {
        const budget = yield prisma_1.default.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget)
            throw new ApiError_1.default(404, "Budget not found");
    }
    return yield prisma_1.default.expense.update({ where: { id }, data, include: { budget: true } });
});
const deleteExpense = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.expense.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Expense not found");
    yield prisma_1.default.expense.delete({ where: { id } });
    return { message: "Expense deleted successfully" };
});
// Income Services
const createIncome = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.budgetId) {
        const budget = yield prisma_1.default.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget)
            throw new ApiError_1.default(404, "Budget not found");
    }
    return yield prisma_1.default.income.create({
        data: Object.assign(Object.assign({}, data), { userId, date: data.date || new Date() }),
        include: { budget: true },
    });
});
const getIncomes = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, budgetId, category, startDate, endDate, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (budgetId)
        whereConditions.budgetId = budgetId;
    if (category)
        whereConditions.category = category;
    if (startDate || endDate) {
        whereConditions.date = {};
        if (startDate)
            whereConditions.date.gte = startDate;
        if (endDate)
            whereConditions.date.lte = endDate;
    }
    const [incomes, total] = yield Promise.all([
        prisma_1.default.income.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { budget: true },
            orderBy: { date: "desc" },
        }),
        prisma_1.default.income.count({ where: whereConditions }),
    ]);
    return { data: incomes, meta: { page, limit, total } };
});
const getIncomeById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const income = yield prisma_1.default.income.findFirst({ where: { id, userId }, include: { budget: true } });
    if (!income)
        throw new ApiError_1.default(404, "Income not found");
    return income;
});
const updateIncome = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.income.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Income not found");
    if (data.budgetId) {
        const budget = yield prisma_1.default.budget.findFirst({ where: { id: data.budgetId, userId } });
        if (!budget)
            throw new ApiError_1.default(404, "Budget not found");
    }
    return yield prisma_1.default.income.update({ where: { id }, data, include: { budget: true } });
});
const deleteIncome = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.income.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Income not found");
    yield prisma_1.default.income.delete({ where: { id } });
    return { message: "Income deleted successfully" };
});
exports.BudgetService = {
    createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget,
    createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense,
    createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome,
};
