import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { Transaction, TransactionFilters } from '../../types';
import { useTransactions } from '../../context/TransactionContext';
import { filterAndSortTransactions } from '../../utils/calculations';
import { TransactionFiltersBar } from './TransactionFiltersBar';
import { TransactionTable } from './TransactionTable';
import { exportTransactionsToCSV } from '../../utils/csv';
import { useToast } from '../../context/ToastContext';

interface TransactionsPageProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteRequest: (tx: Transaction) => void;
}

const defaultFilters: TransactionFilters = {
  searchQuery: '',
  category: 'all',
  type: 'all',
  sortField: 'date',
  sortOrder: 'desc',
};

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onOpenAddModal,
  onEditTransaction,
  onDeleteRequest,
}) => {
  const { transactions } = useTransactions();
  const { showToast } = useToast();
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);

  const handleFilterChange = (updated: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Compute filtered & sorted transactions
  const filteredTransactions = useMemo(() => {
    return filterAndSortTransactions(transactions, filters);
  }, [transactions, filters]);

  const hasFiltersActive =
    Boolean(filters.searchQuery) ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.sortField !== 'date' ||
    filters.sortOrder !== 'desc';

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      showToast('No Data', 'No transactions to export.', 'warning');
      return;
    }
    const success = exportTransactionsToCSV(filteredTransactions);
    if (success) {
      showToast(
        'Export Complete',
        `Exported ${filteredTransactions.length} transaction rows.`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Transaction Ledger</h2>
          <p className="text-xs text-slate-400">
            View, filter, edit, or purge financial activity records
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {filteredTransactions.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Export current view to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TransactionFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={transactions.length}
        filteredCount={filteredTransactions.length}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={onEditTransaction}
        onDeleteRequest={onDeleteRequest}
        onOpenAddModal={onOpenAddModal}
        hasFiltersActive={hasFiltersActive}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
