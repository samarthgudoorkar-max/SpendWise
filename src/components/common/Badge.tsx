import React from 'react';
import { TransactionType } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'neutral' | 'demo' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    income: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expense: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    demo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const TypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  return (
    <Badge variant={type === 'income' ? 'income' : 'expense'}>
      <span className="capitalize">{type}</span>
    </Badge>
  );
};
