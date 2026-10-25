import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  Plus,
} from 'lucide-react';
import { ViewTab } from '../../types';

interface MobileNavProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
}) => {
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
    <>
      {/* Floating Add Action Button on Mobile */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 p-3.5 transition-transform active:scale-95"
          aria-label="Add transaction"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Compact Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#1E293B] border-t border-slate-700/80 px-2 py-1.5 flex items-center justify-around text-xs shadow-xl"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-indigo-500/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
