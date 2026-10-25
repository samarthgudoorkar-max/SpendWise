import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MonthlySummary } from '../../types';
import { paiseToRupees, formatINR } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MonthlyBarChartProps {
  data: MonthlySummary[];
  onOpenAddModal?: () => void;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  onOpenAddModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[360px] flex items-center justify-center">
        <EmptyState
          icon={BarChart3}
          title="No Monthly Data"
          description="Add income or expense transactions to view your monthly cash flow comparison."
          action={onOpenAddModal ? { label: 'Add Transaction', onClick: onOpenAddModal } : undefined}
        />
      </div>
    );
  }

  // Format data for Recharts (values in Rupees for axes/tooltips)
  const chartData = data.map((item) => ({
    name: item.monthLabel,
    Income: paiseToRupees(item.income),
    Expenses: paiseToRupees(item.expenses),
    incomePaise: item.income,
    expensesPaise: item.expenses,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const inc = payload.find((p: any) => p.dataKey === 'Income');
      const exp = payload.find((p: any) => p.dataKey === 'Expenses');
      const incVal = inc ? (inc.payload.incomePaise as number) : 0;
      const expVal = exp ? (exp.payload.expensesPaise as number) : 0;
      const net = incVal - expVal;

      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[170px]">
          <p className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
            {label}
          </p>
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <span>Income:</span>
            <span className="font-medium font-mono">{formatINR(incVal)}</span>
          </div>
          <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
            <span>Expenses:</span>
            <span className="font-medium font-mono">{formatINR(expVal)}</span>
          </div>
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-medium">
            <span className="text-slate-500 dark:text-slate-400">Net:</span>
            <span
              className={`font-mono ${
                net >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatINR(net, { showSign: true })}
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
            Cash Flow Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly income inflows vs. expense outflows
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-300">Expenses</span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -5, bottom: 5 }}
            barGap={6}
          >
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
            <Bar
              dataKey="Income"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="Expenses"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
