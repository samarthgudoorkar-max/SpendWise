import { ExpenseCategory, IncomeCategory, Category } from '../types';

export interface CategoryMeta {
  name: Category;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills',
  'Education',
  'Health',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelancing',
  'Gifts',
  'Other',
];

export const CATEGORY_CONFIG: Record<Category, CategoryMeta> = {
  Food: {
    name: 'Food',
    type: 'expense',
    icon: 'Utensils',
    color: '#F97316', // Orange
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  Shopping: {
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#EC4899', // Pink
    bgColor: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  Transport: {
    name: 'Transport',
    type: 'expense',
    icon: 'Car',
    color: '#3B82F6', // Blue
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  Entertainment: {
    name: 'Entertainment',
    type: 'expense',
    icon: 'Film',
    color: '#8B5CF6', // Purple
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  Bills: {
    name: 'Bills',
    type: 'expense',
    icon: 'Receipt',
    color: '#EAB308', // Yellow
    bgColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  Education: {
    name: 'Education',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#06B6D4', // Cyan
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  Health: {
    name: 'Health',
    type: 'expense',
    icon: 'HeartPulse',
    color: '#10B981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  Other: {
    name: 'Other',
    type: 'expense',
    icon: 'Package',
    color: '#64748B', // Slate
    bgColor: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  Salary: {
    name: 'Salary',
    type: 'income',
    icon: 'Briefcase',
    color: '#10B981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  Freelancing: {
    name: 'Freelancing',
    type: 'income',
    icon: 'Laptop',
    color: '#6366F1', // Indigo
    bgColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  Gifts: {
    name: 'Gifts',
    type: 'income',
    icon: 'Gift',
    color: '#F43F5E', // Rose
    bgColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
};
