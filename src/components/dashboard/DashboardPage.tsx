import React from 'react';
import { SummaryCards } from './SummaryCards';
import { RecentTransactions } from './RecentTransactions';
import { MonthlyBarChart } from '../analytics/MonthlyBarChart';
import { ExpenseDonutChart } from '../analytics/ExpenseDonutChart';
import { useTransactions } from '../../context/TransactionContext';
import { Transaction } from '../../types';
import { Sparkles, Plus, BarChart2 } from 'lucide-react';

interface DashboardPageProps {
  onNavigateToTransactions: () => void;
  onNavigateToAnalytics: () => void;
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteRequest: (tx: Transaction) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToTransactions,
  onNavigateToAnalytics,
  onOpenAddModal,
  onEditTransaction,
  onDeleteRequest,
}) => {
  const {
    transactions,
    monthlySummaries,
    expenseCategoryBreakdown,
    summary,
    loadDemoData,
  } = useTransactions();

  return (
    <div className="space-y-6">
      {/* Welcome / Empty banner if no transactions */}
      {transactions.length === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </div>
            <h2 className="text-lg font-bold text-white">Welcome to SpendWise</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track your cash flow, understand spending trends, and take control of your financial habits with precision Indian Rupee accounting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadDemoData}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-sm"
            >
              Load Demo Data
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Summary Cards */}
      <SummaryCards />

      {/* Analytics Previews Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={monthlySummaries} onOpenAddModal={onOpenAddModal} />
        </div>
        <div className="lg:col-span-1">
          <ExpenseDonutChart
            data={expenseCategoryBreakdown}
            totalExpensesPaise={summary.totalExpenses}
            onOpenAddModal={onOpenAddModal}
          />
        </div>
      </div>

      {/* Quick link to detailed analytics */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E293B] border border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                Explore Full Financial Intelligence
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400">
                Dive deeper into category breakdowns, monthly trajectories, and custom time horizons.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToAnalytics}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 text-xs font-medium transition-colors"
          >
            Open Analytics →
          </button>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 gap-6">
        <RecentTransactions
          onViewAll={onNavigateToTransactions}
          onEdit={onEditTransaction}
          onDeleteRequest={onDeleteRequest}
          onOpenAddModal={onOpenAddModal}
        />
      </div>
    </div>
  );
};
