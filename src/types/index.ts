export type ExpenseCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Bills'
  | 'Education'
  | 'Health'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelancing'
  | 'Gifts'
  | 'Other';

export type Category = ExpenseCategory | IncomeCategory;

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Amount in integer paise (e.g., ₹100.50 is stored as 10050) */
  amount: number;
  category: Category;
  description: string;
  /** ISO format YYYY-MM-DD */
  date: string;
  /** Milliseconds timestamp */
  createdAt: number;
  /** Flag to track demo data */
  isDemo?: boolean;
}

export type TransactionFormData = {
  type: TransactionType;
  amount: string; // User input in rupees as string, e.g. "1250.50"
  category: Category;
  description: string;
  date: string;
};

export interface FinancialSummary {
  totalIncome: number; // paise
  totalExpenses: number; // paise
  balance: number; // paise
  savingsRate: number | null; // percentage e.g. 42.5, null if income is 0
  transactionCount: number;
}

export interface MonthlySummary {
  monthKey: string; // "2025-03"
  monthLabel: string; // "Mar 2025"
  income: number; // paise
  expenses: number; // paise
  netSavings: number; // paise
  savingsRate: number | null;
}

export interface CategorySummary {
  category: Category;
  type: TransactionType;
  totalAmount: number; // paise
  percentage: number; // 0 - 100
  count: number;
  color: string;
  icon: string;
}

export type SortField = 'date' | 'amount' | 'description';
export type SortOrder = 'asc' | 'desc';

export interface TransactionFilters {
  searchQuery: string;
  category: string; // 'all' or Category
  type: 'all' | TransactionType;
  sortField: SortField;
  sortOrder: SortOrder;
  startDate?: string;
  endDate?: string;
}

export type ViewTab = 'dashboard' | 'transactions' | 'analytics' | 'settings';

export type Timeframe = 'all' | 'current-month' | 'last-3-months' | 'last-6-months' | 'this-year';
