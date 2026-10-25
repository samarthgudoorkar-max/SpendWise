import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MonthlySummary } from '../../types';
import { paiseToRupees, formatINR } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SpendingTrendChartProps {
  data: MonthlySummary[];
  onOpenAddModal?: () => void;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  data,
  onOpenAddModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[300px] flex items-center justify-center">
        <EmptyState
          icon={TrendingUp}
          title="No Trend Data"
          description="Record transactions across multiple dates to view your spending trajectory."
          action={onOpenAddModal ? { label: 'Add Transaction', onClick: onOpenAddModal } : undefined}
        />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.monthLabel,
    expensesRupees: paiseToRupees(item.expenses),
    incomeRupees: paiseToRupees(item.income),
    savingsRupees: paiseToRupees(item.netSavings),
    expensesPaise: item.expenses,
    incomePaise: item.income,
    savingsPaise: item.netSavings,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[160px]">
          <p className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
            {label}
          </p>
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Expenses:</span>
            <span className="font-medium font-mono">{formatINR(p.expensesPaise)}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <span>Net Savings:</span>
            <span className="font-medium font-mono">
              {formatINR(p.savingsPaise, { showSign: true })}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700/70 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Spending & Savings Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly expense velocity and net savings performance
          </p>
        </div>
      </div>

      <div className="mt-4 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#E2E8F0'}
              opacity={0.6}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#E2E8F0' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="expensesRupees"
              stroke="#6366F1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
