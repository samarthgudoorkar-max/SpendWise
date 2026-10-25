import { describe, it, expect } from 'vitest';
import {
  calculateFinancialSummary,
  calculateMonthlySummaries,
  calculateExpenseCategoryBreakdown,
  filterAndSortTransactions,
} from '../calculations';
import { Transaction, TransactionFilters } from '../../types';

describe('Financial Calculations', () => {
  it('correctly calculates totals and balance from transactions in paise', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 500000, // ₹5,000.00
        category: 'Salary',
        description: 'Test Salary',
        date: '2025-03-01',
        createdAt: 1000,
      },
      {
        id: '2',
        type: 'expense',
        amount: 200000, // ₹2,000.00
        category: 'Food',
        description: 'Groceries',
        date: '2025-03-05',
        createdAt: 2000,
      },
      {
        id: '3',
        type: 'expense',
        amount: 100000, // ₹1,000.00
        category: 'Bills',
        description: 'Power bill',
        date: '2025-03-10',
        createdAt: 3000,
      },
    ];

    const summary = calculateFinancialSummary(transactions);

    expect(summary.totalIncome).toBe(500000);
    expect(summary.totalExpenses).toBe(300000);
    expect(summary.balance).toBe(200000);
    // Savings rate = (5000 - 3000) / 5000 * 100 = 40.0%
    expect(summary.savingsRate).toBe(40.0);
    expect(summary.transactionCount).toBe(3);
  });

  it('handles zero-income safely without dividing by zero', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 150000,
        category: 'Food',
        description: 'Dinner',
        date: '2025-03-05',
        createdAt: 1000,
      },
    ];

    const summary = calculateFinancialSummary(transactions);

    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpenses).toBe(150000);
    expect(summary.balance).toBe(-150000);
    // Must be null to avoid division by zero or NaN
    expect(summary.savingsRate).toBeNull();
  });

  it('handles empty transaction lists gracefully', () => {
    const summary = calculateFinancialSummary([]);

    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.balance).toBe(0);
    expect(summary.savingsRate).toBeNull();
    expect(summary.transactionCount).toBe(0);
  });

  it('calculates monthly summaries in chronological order', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100000,
        category: 'Salary',
        description: 'Salary Feb',
        date: '2025-02-01',
        createdAt: 1,
      },
      {
        id: '2',
        type: 'income',
        amount: 100000,
        category: 'Salary',
        description: 'Salary Jan',
        date: '2025-01-01',
        createdAt: 2,
      },
      {
        id: '3',
        type: 'expense',
        amount: 50000,
        category: 'Food',
        description: 'Food Jan',
        date: '2025-01-15',
        createdAt: 3,
      },
    ];

    const monthly = calculateMonthlySummaries(transactions);

    expect(monthly.length).toBe(2);
    // Chronological order: Jan first, then Feb
    expect(monthly[0].monthKey).toBe('2025-01');
    expect(monthly[0].income).toBe(100000);
    expect(monthly[0].expenses).toBe(50000);
    expect(monthly[0].netSavings).toBe(50000);
    expect(monthly[0].savingsRate).toBe(50.0);

    expect(monthly[1].monthKey).toBe('2025-02');
    expect(monthly[1].income).toBe(100000);
    expect(monthly[1].expenses).toBe(0);
    expect(monthly[1].savingsRate).toBe(100.0);
  });

  it('calculates expense category breakdown accurately with percentages', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 6000, // ₹60
        category: 'Food',
        description: 'Snacks',
        date: '2025-03-01',
        createdAt: 1,
      },
      {
        id: '2',
        type: 'expense',
        amount: 4000, // ₹40
        category: 'Transport',
        description: 'Bus',
        date: '2025-03-02',
        createdAt: 2,
      },
      {
        id: '3',
        type: 'income',
        amount: 50000,
        category: 'Salary',
        description: 'Salary',
        date: '2025-03-01',
        createdAt: 3,
      },
    ];

    const breakdown = calculateExpenseCategoryBreakdown(transactions);

    // Total expenses = 10000 (₹100)
    // Food = 6000 (60%)
    // Transport = 4000 (40%)
    expect(breakdown.length).toBe(2);
    expect(breakdown[0].category).toBe('Food');
    expect(breakdown[0].totalAmount).toBe(6000);
    expect(breakdown[0].percentage).toBe(60.0);
    expect(breakdown[0].count).toBe(1);

    expect(breakdown[1].category).toBe('Transport');
    expect(breakdown[1].totalAmount).toBe(4000);
    expect(breakdown[1].percentage).toBe(40.0);
    expect(breakdown[1].count).toBe(1);
  });

  it('correctly filters and sorts transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 50000,
        category: 'Food',
        description: 'Lunch at Cafe',
        date: '2025-03-01',
        createdAt: 1,
      },
      {
        id: '2',
        type: 'expense',
        amount: 150000,
        category: 'Bills',
        description: 'Internet bill',
        date: '2025-03-05',
        createdAt: 2,
      },
      {
        id: '3',
        type: 'income',
        amount: 500000,
        category: 'Salary',
        description: 'Monthly Salary',
        date: '2025-03-02',
        createdAt: 3,
      },
    ];

    const filter1: TransactionFilters = {
      searchQuery: 'cafe',
      category: 'all',
      type: 'all',
      sortField: 'date',
      sortOrder: 'desc',
    };
    const res1 = filterAndSortTransactions(transactions, filter1);
    expect(res1.length).toBe(1);
    expect(res1[0].id).toBe('1');

    const filterType: TransactionFilters = {
      searchQuery: '',
      category: 'all',
      type: 'income',
      sortField: 'date',
      sortOrder: 'desc',
    };
    const resType = filterAndSortTransactions(transactions, filterType);
    expect(resType.length).toBe(1);
    expect(resType[0].category).toBe('Salary');

    const filterSort: TransactionFilters = {
      searchQuery: '',
      category: 'all',
      type: 'all',
      sortField: 'amount',
      sortOrder: 'desc',
    };
    const resSort = filterAndSortTransactions(transactions, filterSort);
    expect(resSort[0].amount).toBe(500000);
    expect(resSort[2].amount).toBe(50000);
  });
});
