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
exports.BudgetController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const budget_services_1 = require("./budget.services");
// Budget Controllers
const createBudget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.createBudget((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Budget created successfully", data: result });
}));
const getMyBudgets = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { month, year, page, limit } = req.query;
    const result = yield budget_services_1.BudgetService.getBudgets({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Budgets retrieved successfully", data: result.data, meta: result.meta });
}));
const getBudgetById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.getBudgetById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Budget retrieved successfully", data: result });
}));
const updateBudget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.updateBudget(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Budget updated successfully", data: result });
}));
const deleteBudget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.deleteBudget(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: result.message, data: null });
}));
// Expense Controllers
const createExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.createExpense((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Expense created successfully", data: result });
}));
const getMyExpenses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { budgetId, category, startDate, endDate, page, limit } = req.query;
    const result = yield budget_services_1.BudgetService.getExpenses({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        budgetId: budgetId,
        category: category,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
    });
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Expenses retrieved successfully", data: result.data, meta: result.meta });
}));
const getExpenseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.getExpenseById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Expense retrieved successfully", data: result });
}));
const updateExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.updateExpense(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Expense updated successfully", data: result });
}));
const deleteExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.deleteExpense(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: result.message, data: null });
}));
// Income Controllers
const createIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.createIncome((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Income created successfully", data: result });
}));
const getMyIncomes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { budgetId, category, startDate, endDate, page, limit } = req.query;
    const result = yield budget_services_1.BudgetService.getIncomes({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        budgetId: budgetId,
        category: category,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
    });
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Incomes retrieved successfully", data: result.data, meta: result.meta });
}));
const getIncomeById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.getIncomeById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Income retrieved successfully", data: result });
}));
const updateIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.updateIncome(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Income updated successfully", data: result });
}));
const deleteIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield budget_services_1.BudgetService.deleteIncome(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: result.message, data: null });
}));
exports.BudgetController = {
    createBudget, getMyBudgets, getBudgetById, updateBudget, deleteBudget,
    createExpense, getMyExpenses, getExpenseById, updateExpense, deleteExpense,
    createIncome, getMyIncomes, getIncomeById, updateIncome, deleteIncome,
};
