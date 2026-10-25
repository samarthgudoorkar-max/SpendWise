import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Coins,
  Download,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import { exportTransactionsToCSV } from '../../utils/csv';
import { getStorageDiagnostics } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    transactions,
    isDemoLoaded,
    demoCount,
    userCount,
    loadDemoData,
    removeDemoData,
    resetAllData,
  } = useTransactions();
  const { showToast } = useToast();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRemoveDemoConfirmOpen, setIsRemoveDemoConfirmOpen] = useState(false);
  const [isLoadDemoConfirmOpen, setIsLoadDemoConfirmOpen] = useState(false);

  const diagnostics = getStorageDiagnostics();

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No Data', 'You have no transactions to export.', 'warning');
      return;
    }
    const success = exportTransactionsToCSV(transactions);
    if (success) {
      showToast('Export Successful', `Exported ${transactions.length} transactions as CSV.`, 'success');
    } else {
      showToast('Export Failed', 'An error occurred during CSV export.', 'error');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* 1. Appearance / Theme */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/70">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual presentation</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-indigo-50/20 dark:bg-indigo-600/10 border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Fintech Dark Mode</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Default high-contrast dark theme (#0F172A)
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'light'
                ? 'bg-indigo-50/20 dark:bg-indigo-600/10 border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Clean Light Mode</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Clean daylight palette (#F8FAFC)
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Currency & Arithmetic Precision */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/70">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Currency & Formatting</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fixed financial standard settings</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Base Currency</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All calculations and values are calibrated to Indian Rupees
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono self-start sm:self-auto font-semibold shadow-sm">
              <span>INR (₹) • en-IN</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-300">Integer Paise Storage: </span>
              To eliminate JavaScript IEEE 754 floating-point rounding errors, all amounts are stored
              internally as integer paise (1 INR = 100 paise) and formatted with the Indian numbering
              system (e.g. ₹12,500.00).
            </div>
          </div>
        </div>
      </div>

      {/* 3. CSV Data Export */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/70">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Export Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your full financial ledger as a spreadsheet
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">CSV Export (RFC 4180)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Includes Transaction ID, Date, Description, Category, Type, and Amount in INR.
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Ready to export: {transactions.length} transactions
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Demo Data Controls */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/70">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Sample & Demo Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Populate or clean test transactions</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Demo Records Status</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDemoLoaded
                  ? `Active with ${demoCount} demo transactions across the past 4 months.`
                  : 'No sample demo data currently loaded.'}
                {userCount > 0 && ` (${userCount} custom user records present)`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDemoLoaded ? (
                <button
                  type="button"
                  onClick={() => setIsRemoveDemoConfirmOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 text-xs font-medium transition-colors"
                >
                  Remove Demo Data
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (userCount > 0) {
                      setIsLoadDemoConfirmOpen(true);
                    } else {
                      loadDemoData();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  Load Demo Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Storage Diagnostics & Reset Data */}
      <div className="bg-white dark:bg-[#1E293B] border border-red-200 dark:border-red-900/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/70">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Data Management & Reset</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Storage diagnostic metrics and ledger purging</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Total Records
              </span>
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono mt-0.5 block">
                {diagnostics.count} entries
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Storage Used
              </span>
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono mt-0.5 block">
                {diagnostics.formattedSize}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Storage Engine
              </span>
              <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                LocalStorage
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 gap-3">
            <div>
              <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                Purge All Application Data
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Permanently deletes all transactions from your browser's LocalStorage. This action cannot be undone.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm shrink-0"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title="Reset Application Data?"
        message={
          <>
            Are you sure you want to delete all <span className="font-bold text-slate-900 dark:text-white">{transactions.length}</span> transactions?
            All records will be permanently removed from your browser.
          </>
        }
        confirmLabel="Yes, Reset Everything"
        variant="danger"
        icon="trash"
      />

      <ConfirmDialog
        isOpen={isRemoveDemoConfirmOpen}
        onClose={() => setIsRemoveDemoConfirmOpen(false)}
        onConfirm={removeDemoData}
        title="Remove Demo Data?"
        message={
          <>
            This will remove all <span className="font-bold text-slate-900 dark:text-white">{demoCount}</span> sample demo transactions.
            {userCount > 0 && (
              <span> Your {userCount} custom transaction records will remain safely untouched.</span>
            )}
          </>
        }
        confirmLabel="Remove Demo Data"
        variant="warning"
        icon="warning"
      />

      <ConfirmDialog
        isOpen={isLoadDemoConfirmOpen}
        onClose={() => setIsLoadDemoConfirmOpen(false)}
        onConfirm={loadDemoData}
        title="Load Sample Demo Transactions?"
        message={
          <>
            Realistic multi-month transactions will be added alongside your existing {userCount} records.
            You can remove demo data anytime.
          </>
        }
        confirmLabel="Load Demo Data"
        variant="primary"
        icon="refresh"
      />
    </div>
  );
};
