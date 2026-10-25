import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, Calendar } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatINR } from '../../utils/currency';
import { formatMonthLabel, getCurrentMonthKey } from '../../utils/date';
import { StatCard } from './StatCard';

export const SummaryCards: React.FC = () => {
  const { summary, currentMonthSummary, transactions } = useTransactions();
  const [period, setPeriod] = useState<'all' | 'month'>('month');

  const currentMonthName = formatMonthLabel(getCurrentMonthKey());
  const activeSummary = period === 'all' ? summary : currentMonthSummary;

  // Format savings rate safely
  const formatSavingsRate = (rate: number | null) => {
    if (rate === null) {
      return {
        display: '—',
        badge: 'No Income',
        subValue: 'Income required for savings rate',
      };
    }
    const isPositive = rate >= 0;
    return {
      display: `${rate.toFixed(1)}%`,
      badge: isPositive ? 'Positive' : 'Deficit',
      subValue: isPositive
        ? `${rate.toFixed(1)}% of income saved`
        : `Expenses exceeded income by ${Math.abs(rate).toFixed(1)}%`,
    };
  };

  const savingsRateInfo = formatSavingsRate(activeSummary.savingsRate);

  const balanceVariant =
    activeSummary.balance > 0
      ? 'positive'
      : activeSummary.balance < 0
      ? 'negative'
      : 'neutral';

  return (
    <div className="space-y-4">
      {/* Header controls for Time Horizon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Financial Snapshot</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {period === 'month'
              ? `Metrics for ${currentMonthName} based on recorded activity`
              : `Aggregated lifetime position across ${transactions.length} records`}
          </p>
        </div>

        {/* Toggle between This Month and All Time */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs self-stretch sm:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              period === 'month'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>This Month ({currentMonthName})</span>
          </button>
          <button
            type="button"
            onClick={() => setPeriod('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium transition-all ${
              period === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Balance */}
        <StatCard
          label={period === 'month' ? 'Month Balance' : 'Net Total Balance'}
          value={formatINR(activeSummary.balance)}
          subValue={
            activeSummary.balance >= 0
              ? 'Net positive liquidity'
              : 'Net negative cash deficit'
          }
          icon={Wallet}
          variant={balanceVariant}
          badge={period === 'month' ? currentMonthName : 'Lifetime'}
        />

        {/* 2. Total Income */}
        <StatCard
          label={period === 'month' ? 'Month Inflows' : 'Total Income'}
          value={formatINR(activeSummary.totalIncome)}
          subValue={
            period === 'month'
              ? 'Total credits in current cycle'
              : 'Total recorded cash inflows'
          }
          icon={TrendingUp}
          variant="positive"
        />

        {/* 3. Total Expenses */}
        <StatCard
          label={period === 'month' ? 'Month Outflows' : 'Total Expenses'}
          value={formatINR(activeSummary.totalExpenses)}
          subValue={
            period === 'month'
              ? 'Total debits in current cycle'
              : 'Total recorded cash outflows'
          }
          icon={TrendingDown}
          variant="negative"
        />

        {/* 4. Savings Rate */}
        <StatCard
          label="Savings Rate"
          value={savingsRateInfo.display}
          subValue={savingsRateInfo.subValue}
          icon={Percent}
          variant={
            activeSummary.savingsRate === null
              ? 'neutral'
              : activeSummary.savingsRate >= 20
              ? 'positive'
              : activeSummary.savingsRate > 0
              ? 'accent'
              : 'negative'
          }
          badge={savingsRateInfo.badge}
        />
      </div>
    </div>
  );
};
