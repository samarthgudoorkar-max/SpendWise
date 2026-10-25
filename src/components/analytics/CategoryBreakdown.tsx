import React from 'react';
import { CategorySummary } from '../../types';
import { formatINR } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { EmptyState } from '../common/EmptyState';
import { Tag } from 'lucide-react';

interface CategoryBreakdownProps {
  data: CategorySummary[];
  totalExpensesPaise: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  totalExpensesPaise,
}) => {
  if (data.length === 0 || totalExpensesPaise === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
        <EmptyState
          icon={Tag}
          title="No Categories Available"
          description="Expense categories will appear here once you record spending."
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-700/70">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Category Spending Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Detailed metrics across each spending classification
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <th className="pb-3 pl-2">Category</th>
              <th className="pb-3 text-right">Total Spent</th>
              <th className="pb-3 px-4">% Share</th>
              <th className="pb-3 text-center">Tx Count</th>
              <th className="pb-3 text-right pr-2">Avg / Tx</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {data.map((item) => {
              const avgPaise = Math.round(item.totalAmount / item.count);
              return (
                <tr
                  key={item.category}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 pl-2 flex items-center gap-2.5 font-medium text-slate-900 dark:text-slate-200">
                    <CategoryIcon category={item.category} size={15} withBackground />
                    <span>{item.category}</span>
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatINR(item.totalAmount)}
                  </td>
                  <td className="py-3 px-4 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(item.percentage, 100)}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 w-9 text-right">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center text-slate-700 dark:text-slate-300 font-mono">
                    {item.count}
                  </td>
                  <td className="py-3 text-right pr-2 font-mono text-slate-500 dark:text-slate-400">
                    {formatINR(avgPaise)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
