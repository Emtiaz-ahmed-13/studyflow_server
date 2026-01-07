import { ExpenseCategory, IncomeCategory } from "@prisma/client";

export interface IBudget {
    id: string;
    name: string;
    totalBudget: number;
    month: number;
    year: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateBudget {
    name: string;
    totalBudget: number;
    month: number;
    year: number;
}

export interface IUpdateBudget {
    name?: string;
    totalBudget?: number;
    month?: number;
    year?: number;
}

export interface IBudgetFilters {
    userId: string;
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
}

export interface IExpense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    description?: string;
    date: Date;
    budgetId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateExpense {
    amount: number;
    category: ExpenseCategory;
    description?: string;
    date?: Date;
    budgetId?: string;
}

export interface IUpdateExpense {
    amount?: number;
    category?: ExpenseCategory;
    description?: string;
    date?: Date;
    budgetId?: string;
}

export interface IExpenseFilters {
    userId: string;
    budgetId?: string;
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}

export interface IIncome {
    id: string;
    amount: number;
    category: IncomeCategory;
    description?: string;
    date: Date;
    budgetId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateIncome {
    amount: number;
    category: IncomeCategory;
    description?: string;
    date?: Date;
    budgetId?: string;
}

export interface IUpdateIncome {
    amount?: number;
    category?: IncomeCategory;
    description?: string;
    date?: Date;
    budgetId?: string;
}

export interface IIncomeFilters {
    userId: string;
    budgetId?: string;
    category?: IncomeCategory;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
