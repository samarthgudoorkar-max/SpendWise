import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  FinancialSummary,
  MonthlySummary,
  CategorySummary,
  Category,
  TransactionType,
} from '../types';
import {
  loadStoredTransactions,
  saveTransactions,
  clearStoredTransactions,
  isAppInitialized,
  setAppInitialized,
} from '../utils/storage';
import {
  calculateFinancialSummary,
  calculateCurrentMonthSummary,
  calculateMonthlySummaries,
  calculateExpenseCategoryBreakdown,
} from '../utils/calculations';
import { generateSampleTransactions } from '../data/sampleData';
import { useToast } from './ToastContext';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  isDemoLoaded: boolean;
  demoCount: number;
  userCount: number;
  addTransaction: (data: {
    type: TransactionType;
    amount: number;
    category: Category;
    description: string;
    date: string;
  }) => Transaction;
  updateTransaction: (
    id: string,
    data: {
      type: TransactionType;
      amount: number;
      category: Category;
      description: string;
      date: string;
    }
  ) => boolean;
  deleteTransaction: (id: string) => boolean;
  loadDemoData: () => void;
  removeDemoData: () => void;
  resetAllData: () => void;
  summary: FinancialSummary;
  currentMonthSummary: FinancialSummary;
  monthlySummaries: MonthlySummary[];
  expenseCategoryBreakdown: CategorySummary[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load from LocalStorage on mount
  useEffect(() => {
    const { transactions: stored, corruptedCount, hasErrors } = loadStoredTransactions();

    if (hasErrors && corruptedCount > 0) {
      showToast(
        'Storage Warning',
        `Recovered and filtered out ${corruptedCount} corrupted records from storage.`,
        'warning'
      );
    }

    if (stored.length > 0) {
      setTransactions(stored);
    } else if (!isAppInitialized()) {
      // First time user experience: initialize with realistic sample data
      const demo = generateSampleTransactions();
      setTransactions(demo);
      saveTransactions(demo);
      setAppInitialized();
      showToast('Welcome to SpendWise', 'Loaded sample financial data so you can explore the dashboard.', 'info');
    }

    setIsLoading(false);
  }, [showToast]);

  // Sync to LocalStorage whenever transactions state changes (after initial load)
  const persistTransactions = useCallback((updated: Transaction[]) => {
    setTransactions(updated);
    saveTransactions(updated);
  }, []);

  const addTransaction = useCallback(
    (data: {
      type: TransactionType;
      amount: number;
      category: Category;
      description: string;
      date: string;
    }) => {
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description.trim(),
        date: data.date,
        createdAt: Date.now(),
        isDemo: false,
      };

      const updated = [newTransaction, ...transactions];
      // Keep sorted by date descending, then createdAt descending
      updated.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

      persistTransactions(updated);
      showToast('Transaction Added', `${data.type === 'income' ? 'Income' : 'Expense'} entry created successfully.`, 'success');
      return newTransaction;
    },
    [transactions, persistTransactions, showToast]
  );

  const updateTransaction = useCallback(
    (
      id: string,
      data: {
        type: TransactionType;
        amount: number;
        category: Category;
        description: string;
        date: string;
      }
    ) => {
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) {
        showToast('Error', 'Transaction not found.', 'error');
        return false;
      }

      const existing = transactions[index];
      const updatedItem: Transaction = {
        ...existing,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description.trim(),
        date: data.date,
        isDemo: false, // Once edited, it becomes a user transaction
      };

      const updated = [...transactions];
      updated[index] = updatedItem;
      updated.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

      persistTransactions(updated);
      showToast('Transaction Updated', 'Changes have been saved.', 'success');
      return true;
    },
    [transactions, persistTransactions, showToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const target = transactions.find((t) => t.id === id);
      if (!target) {
        showToast('Error', 'Transaction could not be found.', 'error');
        return false;
      }

      const updated = transactions.filter((t) => t.id !== id);
      persistTransactions(updated);
      showToast('Transaction Deleted', `"${target.description}" was removed.`, 'info');
      return true;
    },
    [transactions, persistTransactions, showToast]
  );

  const loadDemoData = useCallback(() => {
    // Generate fresh demo transactions
    const demo = generateSampleTransactions();
    // Keep any real user transactions intact!
    const userOnly = transactions.filter((t) => !t.isDemo);
    const combined = [...userOnly, ...demo].sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt
    );

    persistTransactions(combined);
    setAppInitialized();
    showToast('Demo Data Loaded', `Added ${demo.length} realistic sample transactions.`, 'success');
  }, [transactions, persistTransactions, showToast]);

  const removeDemoData = useCallback(() => {
    const remaining = transactions.filter((t) => !t.isDemo);
    const removedCount = transactions.length - remaining.length;
    persistTransactions(remaining);
    showToast('Demo Data Removed', `Removed ${removedCount} sample transactions. User records preserved.`, 'info');
  }, [transactions, persistTransactions, showToast]);

  const resetAllData = useCallback(() => {
    clearStoredTransactions();
    setTransactions([]);
    showToast('Data Reset', 'All transactions have been deleted and storage cleared.', 'warning');
  }, [showToast]);

  // Derived metrics
  const isDemoLoaded = useMemo(() => transactions.some((t) => t.isDemo), [transactions]);
  const demoCount = useMemo(() => transactions.filter((t) => t.isDemo).length, [transactions]);
  const userCount = useMemo(() => transactions.filter((t) => !t.isDemo).length, [transactions]);

  const summary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const currentMonthSummary = useMemo(() => calculateCurrentMonthSummary(transactions), [transactions]);
  const monthlySummaries = useMemo(() => calculateMonthlySummaries(transactions), [transactions]);
  const expenseCategoryBreakdown = useMemo(
    () => calculateExpenseCategoryBreakdown(transactions),
    [transactions]
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        isDemoLoaded,
        demoCount,
        userCount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadDemoData,
        removeDemoData,
        resetAllData,
        summary,
        currentMonthSummary,
        monthlySummaries,
        expenseCategoryBreakdown,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
