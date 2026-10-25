import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  variant?: 'positive' | 'negative' | 'accent' | 'neutral';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  variant = 'neutral',
  badge,
}) => {
  const variantConfig = {
    positive: {
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      valColor: 'text-emerald-600 dark:text-emerald-400',
    },
    negative: {
      iconColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
      valColor: 'text-red-600 dark:text-red-400',
    },
    accent: {
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
      valColor: 'text-indigo-600 dark:text-indigo-400',
    },
    neutral: {
      iconColor: 'text-slate-600 dark:text-slate-300',
      iconBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      valColor: 'text-slate-900 dark:text-slate-100',
    },
  };

  const config = variantConfig[variant];

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-lg border ${config.iconBg}`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
      </div>

      <div className="mt-3">
        <div className={`text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100`}>
          {value}
        </div>
        {(subValue || badge) && (
          <div className="mt-1.5 flex items-center gap-2">
            {badge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {badge}
              </span>
            )}
            {subValue && (
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{subValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
