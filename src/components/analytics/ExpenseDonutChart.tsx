import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategorySummary } from '../../types';
import { formatINR, paiseToRupees } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { useTheme } from '../../context/ThemeContext';

interface ExpenseDonutChartProps {
  data: CategorySummary[];
  totalExpensesPaise: number;
  onOpenAddModal?: () => void;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  data,
  totalExpensesPaise,
  onOpenAddModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (data.length === 0 || totalExpensesPaise === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm min-h-[360px] flex items-center justify-center">
        <EmptyState
          icon={PieIcon}
          title="No Expense Data"
          description="Add expense transactions to see your spending category breakdown."
          action={onOpenAddModal ? { label: 'Add Expense', onClick: onOpenAddModal } : undefined}
        />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: paiseToRupees(item.totalAmount),
    paise: item.totalAmount,
    percentage: item.percentage,
    color: item.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
          </div>
          <div className="text-slate-900 dark:text-slate-100 font-mono text-sm font-bold">
            {formatINR(entry.paise)}
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            {entry.percentage.toFixed(1)}% of total expenses
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-700/70">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Expense Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Proportional spending by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center flex-1 mt-4">
        {/* Donut Chart with Centered Total */}
        <div className="relative h-[220px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                stroke={isDark ? '#1E293B' : '#FFFFFF'}
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Total Spend
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatINR(totalExpensesPaise, { compact: true })}
            </span>
          </div>
        </div>

        {/* Category Legend List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {data.slice(0, 5).map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CategoryIcon category={item.category} size={14} />
                <span className="text-slate-700 dark:text-slate-200 truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-2 text-right shrink-0">
                <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                  {formatINR(item.totalAmount)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] w-10">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
          {data.length > 5 && (
            <p className="text-[11px] text-slate-400 text-center pt-1">
              +{data.length - 5} more categories below
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
