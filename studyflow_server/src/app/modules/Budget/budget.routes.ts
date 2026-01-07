import express from "express";
import auth from "../../middleware/auth";
import { BudgetController } from "./budget.controllers";

const router = express.Router();

// Budget routes
router.post("/budgets", auth(), BudgetController.createBudget);
router.get("/budgets", auth(), BudgetController.getMyBudgets);
router.get("/budgets/:id", auth(), BudgetController.getBudgetById);
router.patch("/budgets/:id", auth(), BudgetController.updateBudget);
router.delete("/budgets/:id", auth(), BudgetController.deleteBudget);

// Expense routes
router.post("/expenses", auth(), BudgetController.createExpense);
router.get("/expenses", auth(), BudgetController.getMyExpenses);
router.get("/expenses/:id", auth(), BudgetController.getExpenseById);
router.patch("/expenses/:id", auth(), BudgetController.updateExpense);
router.delete("/expenses/:id", auth(), BudgetController.deleteExpense);

// Income routes
router.post("/incomes", auth(), BudgetController.createIncome);
router.get("/incomes", auth(), BudgetController.getMyIncomes);
router.get("/incomes/:id", auth(), BudgetController.getIncomeById);
router.patch("/incomes/:id", auth(), BudgetController.updateIncome);
router.delete("/incomes/:id", auth(), BudgetController.deleteIncome);

export const BudgetRoutes = router;
