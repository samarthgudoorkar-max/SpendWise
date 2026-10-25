import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { Transaction } from '../../types';
import { formatINR } from '../../utils/currency';
import { formatFullDate } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';
import { TypeBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
  hasFiltersActive: boolean;
  onResetFilters: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDeleteRequest,
  onOpenAddModal,
  hasFiltersActive,
  onResetFilters,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentTransactions = transactions.slice(startIndex, startIndex + pageSize);

  if (transactions.length === 0) {
    if (hasFiltersActive) {
      return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm">
          <EmptyState
            icon={Receipt}
            title="No Matching Transactions"
            description="No transactions match your current search and filter criteria."
            action={{
              label: 'Reset Filters',
              onClick: onResetFilters,
            }}
          />
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm">
        <EmptyState
          icon={Receipt}
          title="No Transactions Recorded"
          description="Your registry is currently empty. Record your first transaction to get started."
          action={{
            label: 'Add Transaction',
            onClick: onOpenAddModal,
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
            {currentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-xs">
                    {formatFullDate(tx.date)}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{tx.description}</span>
                      {tx.isDemo && (
                        <span className="shrink-0 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
                          Demo
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={tx.category} size={15} />
                      <span className="text-slate-700 dark:text-slate-300 text-xs">{tx.category}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <TypeBadge type={tx.type} />
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 px-4 whitespace-nowrap text-right font-mono font-semibold text-sm ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {formatINR(tx.amount, { showSign: true, type: tx.type })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        title="Edit transaction"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        aria-label={`Edit ${tx.description}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(tx)}
                        title="Delete transaction"
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
                        aria-label={`Delete ${tx.description}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-slate-200">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {Math.min(startIndex + pageSize, transactions.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900 dark:text-slate-200">{transactions.length}</span>{' '}
            records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
