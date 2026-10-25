import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  Plus,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ViewTab } from '../../types';
import { useTransactions } from '../../context/TransactionContext';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
}) => {
  const { isDemoLoaded, demoCount, removeDemoData } = useTransactions();

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      tab: 'transactions',
      label: 'Transactions',
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      tab: 'analytics',
      label: 'Analytics',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1E293B] border-r border-slate-700/80 min-h-screen text-slate-200 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700/70 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-lg">
          ₹
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            SpendWise
          </span>
          <span className="text-[10px] text-slate-400 font-medium block tracking-wide uppercase">
            Financial Analytics
          </span>
        </div>
      </div>

      {/* Quick Add Action Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-700/70 text-indigo-400 border-l-4 border-indigo-500 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Demo Data Banner if loaded */}
      {isDemoLoaded && (
        <div className="m-3 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Demo Data Active</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
            Showing {demoCount} realistic demo records.
          </p>
          <button
            type="button"
            onClick={removeDemoData}
            className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 text-[11px] font-medium transition-colors border border-indigo-700/50"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Demo Data</span>
          </button>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700/70 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Storage Only</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};
