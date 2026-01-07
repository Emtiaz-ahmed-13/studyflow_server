"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const budget_controllers_1 = require("./budget.controllers");
const router = express_1.default.Router();
// Budget routes
router.post("/budgets", (0, auth_1.default)(), budget_controllers_1.BudgetController.createBudget);
router.get("/budgets", (0, auth_1.default)(), budget_controllers_1.BudgetController.getMyBudgets);
router.get("/budgets/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.getBudgetById);
router.patch("/budgets/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.updateBudget);
router.delete("/budgets/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.deleteBudget);
// Expense routes
router.post("/expenses", (0, auth_1.default)(), budget_controllers_1.BudgetController.createExpense);
router.get("/expenses", (0, auth_1.default)(), budget_controllers_1.BudgetController.getMyExpenses);
router.get("/expenses/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.getExpenseById);
router.patch("/expenses/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.updateExpense);
router.delete("/expenses/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.deleteExpense);
// Income routes
router.post("/incomes", (0, auth_1.default)(), budget_controllers_1.BudgetController.createIncome);
router.get("/incomes", (0, auth_1.default)(), budget_controllers_1.BudgetController.getMyIncomes);
router.get("/incomes/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.getIncomeById);
router.patch("/incomes/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.updateIncome);
router.delete("/incomes/:id", (0, auth_1.default)(), budget_controllers_1.BudgetController.deleteIncome);
exports.BudgetRoutes = router;
