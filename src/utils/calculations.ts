import {
  Transaction,
  FinancialSummary,
  MonthlySummary,
  CategorySummary,
  Category,
  TransactionFilters,
} from '../types';
import { getMonthKeyFromISO, formatMonthLabel, getCurrentMonthKey } from './date';
import { CATEGORY_CONFIG } from '../data/categories';

/**
 * Calculates financial summary (total income, expenses, balance, savings rate)
 * from a list of transactions.
 * All amounts are in integer paise.
 */
export function calculateFinancialSummary(transactions: Transaction[]): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else if (t.type === 'expense') {
      totalExpenses += t.amount;
    }
  }

  const balance = totalIncome - totalExpenses;

  // Savings rate calculation: (Income - Expenses) / Income * 100
  // Safe zero-income handling: returns null if income <= 0
  let savingsRate: number | null = null;
  if (totalIncome > 0) {
    const rawRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    // Round to 1 decimal place
    savingsRate = Math.round(rawRate * 10) / 10;
  }

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    transactionCount: transactions.length,
  };
}

/**
 * Returns transactions filtered strictly for the given month key (YYYY-MM).
 */
export function filterTransactionsByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((t) => getMonthKeyFromISO(t.date) === monthKey);
}

/**
 * Calculates current month's financial summary.
 */
export function calculateCurrentMonthSummary(transactions: Transaction[]): FinancialSummary {
  const currentMonth = getCurrentMonthKey();
  const monthTransactions = filterTransactionsByMonth(transactions, currentMonth);
  return calculateFinancialSummary(monthTransactions);
}

/**
 * Groups transactions by month and calculates monthly metrics for charts and trends.
 * Guaranteed to be sorted chronologically from oldest to newest.
 */
export function calculateMonthlySummaries(transactions: Transaction[]): MonthlySummary[] {
  if (transactions.length === 0) return [];

  const map = new Map<string, { income: number; expenses: number }>();

  for (const t of transactions) {
    const monthKey = getMonthKeyFromISO(t.date);
    if (!monthKey) continue;

    const existing = map.get(monthKey) || { income: 0, expenses: 0 };
    if (t.type === 'income') {
      existing.income += t.amount;
    } else {
      existing.expenses += t.amount;
    }
    map.set(monthKey, existing);
  }

  // Sort chronologically ascending
  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map((key) => {
    const data = map.get(key)!;
    const netSavings = data.income - data.expenses;
    let savingsRate: number | null = null;
    if (data.income > 0) {
      savingsRate = Math.round(((data.income - data.expenses) / data.income) * 1000) / 10;
    }

    return {
      monthKey: key,
      monthLabel: formatMonthLabel(key),
      income: data.income,
      expenses: data.expenses,
      netSavings,
      savingsRate,
    };
  });
}

/**
 * Aggregates expenses by category with percentages and counts.
 */
export function calculateExpenseCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (totalExpenses === 0) return [];

  const categoryMap = new Map<Category, { total: number; count: number }>();

  for (const t of expenseTransactions) {
    const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
    existing.total += t.amount;
    existing.count += 1;
    categoryMap.set(t.category, existing);
  }

  const summaries: CategorySummary[] = [];

  categoryMap.forEach((val, category) => {
    const meta = CATEGORY_CONFIG[category] || {
      color: '#94A3B8',
      icon: 'Tag',
      name: category,
      type: 'expense',
    };

    const percentage = Math.round((val.total / totalExpenses) * 1000) / 10;

    summaries.push({
      category,
      type: 'expense',
      totalAmount: val.total,
      percentage,
      count: val.count,
      color: meta.color,
      icon: meta.icon,
    });
  });

  // Sort descending by highest expense
  return summaries.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Filters and sorts transactions according to user selections.
 */
export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  let result = [...transactions];

  // Search filter (description, category)
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category);
  }

  // Date range filter
  if (filters.startDate) {
    result = result.filter((t) => t.date >= filters.startDate!);
  }
  if (filters.endDate) {
    result = result.filter((t) => t.date <= filters.endDate!);
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0;
    if (filters.sortField === 'date') {
      comparison = a.date.localeCompare(b.date);
    } else if (filters.sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (filters.sortField === 'description') {
      comparison = a.description.localeCompare(b.description);
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
}
