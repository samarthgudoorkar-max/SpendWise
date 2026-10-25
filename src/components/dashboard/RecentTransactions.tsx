import React from 'react';
import { ArrowRight, Receipt, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { useTransactions } from '../../context/TransactionContext';
import { formatINR } from '../../utils/currency';
import { formatRelativeDate } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';
import { EmptyState } from '../common/EmptyState';

interface RecentTransactionsProps {
  onViewAll: () => void;
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onViewAll,
  onEdit,
  onDeleteRequest,
  onOpenAddModal,
}) => {
  const { transactions } = useTransactions();
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700/70">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Latest entries posted to your account</p>
        </div>
        {transactions.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View all ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-4">
        {recent.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Start recording your finances by adding your first transaction."
            action={{
              label: 'Add Transaction',
              onClick: onOpenAddModal,
            }}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon category={tx.category} size={16} withBackground />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{formatRelativeDate(tx.date)}</span>
                        {tx.isDemo && (
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-500/20">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={`text-sm font-semibold tracking-tight text-right ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {formatINR(tx.amount, { showSign: true, type: tx.type })}
                    </div>

                    {/* Quick Row Actions on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        title="Edit transaction"
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(tx)}
                        title="Delete transaction"
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
