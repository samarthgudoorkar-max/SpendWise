import React, { useState, useMemo } from 'react';
import { MonthlyBarChart } from './MonthlyBarChart';
import { ExpenseDonutChart } from './ExpenseDonutChart';
import { SpendingTrendChart } from './SpendingTrendChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { useTransactions } from '../../context/TransactionContext';
import {
  calculateMonthlySummaries,
  calculateExpenseCategoryBreakdown,
  calculateFinancialSummary,
} from '../../utils/calculations';
import { formatINR } from '../../utils/currency';
import { getPastMonthsKeys } from '../../utils/date';

export const AnalyticsPage: React.FC<{ onOpenAddModal: () => void }> = ({
  onOpenAddModal,
}) => {
  const { transactions } = useTransactions();
  const [range, setRange] = useState<'all' | '6m' | '3m'>('all');

  // Filter transactions based on selected range
  const scopedTransactions = useMemo(() => {
    if (range === 'all') return transactions;
    const pastKeys = new Set(getPastMonthsKeys(range === '6m' ? 6 : 3));
    return transactions.filter((t) => pastKeys.has(t.date.substring(0, 7)));
  }, [transactions, range]);

  const scopedMonthlySummaries = useMemo(
    () => calculateMonthlySummaries(scopedTransactions),
    [scopedTransactions]
  );

  const scopedCategoryBreakdown = useMemo(
    () => calculateExpenseCategoryBreakdown(scopedTransactions),
    [scopedTransactions]
  );

  const scopedSummary = useMemo(
    () => calculateFinancialSummary(scopedTransactions),
    [scopedTransactions]
  );

  return (
    <div className="space-y-6">
      {/* Header and Scope Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Financial Intelligence</h2>
          <p className="text-xs text-slate-400">
            Comprehensive analysis of income sources, spending patterns, and margins
          </p>
        </div>

        {/* Time horizon pill selector */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRange('3m')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              range === '3m'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 3 Months
          </button>
          <button
            type="button"
            onClick={() => setRange('6m')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              range === '6m'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 6 Months
          </button>
          <button
            type="button"
            onClick={() => setRange('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              range === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {/* Quick Scoped Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 shadow-sm">
        <div className="p-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Total Inflow
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            {formatINR(scopedSummary.totalIncome)}
          </div>
        </div>

        <div className="p-2 border-l border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Total Outflow
          </div>
          <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
            {formatINR(scopedSummary.totalExpenses)}
          </div>
        </div>

        <div className="p-2 border-l border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Net Savings
          </div>
          <div
            className={`text-lg font-bold font-mono mt-0.5 ${
              scopedSummary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {formatINR(scopedSummary.balance, { showSign: true })}
          </div>
        </div>

        <div className="p-2 border-l border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Savings Margin
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
            {scopedSummary.savingsRate !== null
              ? `${scopedSummary.savingsRate.toFixed(1)}%`
              : '—'}
          </div>
        </div>
      </div>

      {/* Row 1: Monthly Bar Chart & Expense Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyBarChart
            data={scopedMonthlySummaries}
            onOpenAddModal={onOpenAddModal}
          />
        </div>
        <div className="lg:col-span-1">
          <ExpenseDonutChart
            data={scopedCategoryBreakdown}
            totalExpensesPaise={scopedSummary.totalExpenses}
            onOpenAddModal={onOpenAddModal}
          />
        </div>
      </div>

      {/* Row 2: Spending Trajectory */}
      <SpendingTrendChart
        data={scopedMonthlySummaries}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Row 3: Category Breakdown Table */}
      <CategoryBreakdown
        data={scopedCategoryBreakdown}
        totalExpensesPaise={scopedSummary.totalExpenses}
      />
    </div>
  );
};
