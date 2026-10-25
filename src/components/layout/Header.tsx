import React from 'react';
import { Sun, Moon, Plus, Sparkles, Download } from 'lucide-react';
import { ViewTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import { exportTransactionsToCSV } from '../../utils/csv';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  currentTab: ViewTab;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenAddModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { isDemoLoaded, demoCount, transactions } = useTransactions();
  const { showToast } = useToast();

  const tabTitles: Record<ViewTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time financial position and cash flow analysis',
    },
    transactions: {
      title: 'Transactions Registry',
      subtitle: 'Complete record of all income and expenses',
    },
    analytics: {
      title: 'Financial Analytics',
      subtitle: 'Trends, category distributions, and spending intelligence',
    },
    settings: {
      title: 'Application Settings',
      subtitle: 'Preferences, data exports, and storage maintenance',
    },
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No Data', 'There are no transactions to export.', 'warning');
      return;
    }
    const ok = exportTransactionsToCSV(transactions);
    if (ok) {
      showToast('Export Complete', 'Downloaded transactions as CSV file.', 'success');
    } else {
      showToast('Export Failed', 'Could not export CSV.', 'error');
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-[#1E293B]/70 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Brand Mark */}
        <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
          ₹
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {tabTitles[currentTab].title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {tabTitles[currentTab].subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo status tag */}
        {isDemoLoaded && (
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Data ({demoCount})</span>
          </span>
        )}

        {/* Quick CSV Export */}
        <button
          type="button"
          onClick={handleExportCSV}
          title="Export transactions as CSV"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors"
          aria-label="Export transactions to CSV"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors"
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Desktop Quick Add Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
