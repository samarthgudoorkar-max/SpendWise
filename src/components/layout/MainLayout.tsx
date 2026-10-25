import React, { useState } from 'react';
import { ViewTab, Transaction } from '../../types';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';
import { DashboardPage } from '../dashboard/DashboardPage';
import { TransactionsPage } from '../transactions/TransactionsPage';
import { AnalyticsPage } from '../analytics/AnalyticsPage';
import { SettingsView } from '../settings/SettingsView';
import { TransactionModal } from '../transactions/TransactionModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useTransactions } from '../../context/TransactionContext';
import { formatINR } from '../../utils/currency';

export const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const handleModalSubmit = (data: {
    type: 'income' | 'expense';
    amount: number;
    category: any;
    description: string;
    date: string;
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateToTransactions={() => setCurrentTab('transactions')}
            onNavigateToAnalytics={() => setCurrentTab('analytics')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onEditTransaction={handleEdit}
            onDeleteRequest={setDeletingTransaction}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onEditTransaction={handleEdit}
            onDeleteRequest={setDeletingTransaction}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage onOpenAddModal={() => setIsAddModalOpen(true)} />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header
          currentTab={currentTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Compact Navigation */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        transactionToEdit={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={
          deletingTransaction ? (
            <>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                "{deletingTransaction.description}"
              </span>{' '}
              for{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {formatINR(deletingTransaction.amount)}
              </span>
              ?
            </>
          ) : (
            'Are you sure you want to delete this transaction?'
          )
        }
        confirmLabel="Delete Transaction"
        variant="danger"
        icon="trash"
      />
    </div>
  );
};
