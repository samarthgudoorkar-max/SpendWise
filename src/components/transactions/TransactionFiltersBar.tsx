import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { TransactionFilters, Category } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (updated: Partial<TransactionFilters>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export const TransactionFiltersBar: React.FC<TransactionFiltersBarProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  const allCategories: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.type !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top row: Search input & Type Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search transactions by description or category..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs self-start md:self-auto shrink-0 shadow-sm">
          <button
            type="button"
            onClick={() => onChange({ type: 'all' })}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.type === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'income' })}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.type === 'income'
                ? 'bg-emerald-50 dark:bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'expense' })}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.type === 'expense'
                ? 'bg-red-50 dark:bg-red-600/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Bottom row: Category Filter, Sort Field, Sort Order, Results counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                All Categories
              </option>
              {allCategories.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Field & Order */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={`${filters.sortField}-${filters.sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [any, any];
                onChange({ sortField: field, sortOrder: order });
              }}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="date-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Date: Newest First
              </option>
              <option value="date-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Date: Oldest First
              </option>
              <option value="amount-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Amount: High to Low
              </option>
              <option value="amount-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Amount: Low to High
              </option>
              <option value="description-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Description: A to Z
              </option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium px-2 py-1 underline underline-offset-2"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-slate-500 dark:text-slate-400 text-xs font-mono">
          Showing <span className="text-slate-900 dark:text-slate-200 font-semibold">{filteredCount}</span> of{' '}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">{totalCount}</span> entries
        </div>
      </div>
    </div>
  );
};
