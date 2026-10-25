import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../../types';
import { Modal } from '../common/Modal';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { validateAmount, paiseToRupees } from '../../utils/currency';
import { getTodayISO } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: TransactionType;
    amount: number; // in integer paise
    category: Category;
    description: string;
    date: string;
  }) => void;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit,
}) => {
  const isEditing = Boolean(transactionToEdit);

  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayISO());

  const [errors, setErrors] = useState<{
    amount?: string;
    description?: string;
    date?: string;
    category?: string;
  }>({});

  // Reset or populate form when opening or changing transactionToEdit
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmountStr(paiseToRupees(transactionToEdit.amount).toString());
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setDate(transactionToEdit.date);
    } else {
      setType('expense');
      setAmountStr('');
      setCategory('Food');
      setDescription('');
      setDate(getTodayISO());
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  // Handle switching type (Income / Expense)
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      if (!INCOME_CATEGORIES.includes(category as any)) {
        setCategory('Salary');
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category as any)) {
        setCategory('Food');
      }
    }
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate amount
    const amountValidation = validateAmount(amountStr);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters';
    } else if (description.trim().length > 100) {
      newErrors.description = 'Description must be under 100 characters';
    }

    // Validate date
    if (!date) {
      newErrors.date = 'Date is required';
    }

    // Validate category matches type
    const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!validCategories.includes(category as any)) {
      newErrors.category = 'Please select a valid category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? amountValidation.paise : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paise = validateForm();
    if (paise === null) return;

    onSubmit({
      type,
      amount: paise,
      category,
      description: description.trim(),
      date,
    });
    onClose();
  };

  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      description={
        isEditing
          ? 'Update the details for this transaction record.'
          : 'Record a new income or expense transaction.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle Tabs */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                type === 'expense'
                  ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                type === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
          >
            Amount (₹ INR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 font-medium">
              ₹
            </div>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border ${
                errors.amount
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
              } rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
              autoFocus={!isEditing}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.amount}</p>
          )}
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Stored internally in exact integer paise to prevent rounding errors.
          </p>
        </div>

        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CategoryIcon category={category} size={16} />
            </div>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category);
                if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer appearance-none"
            >
              {availableCategories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <input
            id="description"
            type="text"
            placeholder="e.g., Grocery shopping at Nature's Basket"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            maxLength={100}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border ${
              errors.description
                ? 'border-red-500'
                : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
            } rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label
            htmlFor="date"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
          >
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            max="2099-12-31"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border ${
              errors.date
                ? 'border-red-500'
                : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
            } rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.date}</p>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
