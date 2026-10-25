import { Transaction } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { isValidISODate } from './date';

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions_v1',
  THEME: 'spendwise_theme_v1',
  HAS_INITIALIZED: 'spendwise_initialized_v1',
};

const ALL_VALID_CATEGORIES = new Set<string>([
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
]);

/**
 * Validates whether an arbitrary object conforms to a valid Transaction.
 */
function isValidTransaction(item: unknown): item is Transaction {
  if (!item || typeof item !== 'object') return false;

  const t = item as Record<string, unknown>;

  if (typeof t.id !== 'string' || t.id.trim() === '') return false;
  if (t.type !== 'income' && t.type !== 'expense') return false;

  // Amount must be an integer > 0 (in paise)
  if (
    typeof t.amount !== 'number' ||
    !Number.isFinite(t.amount) ||
    isNaN(t.amount) ||
    t.amount <= 0 ||
    !Number.isInteger(t.amount)
  ) {
    return false;
  }

  if (typeof t.category !== 'string' || !ALL_VALID_CATEGORIES.has(t.category)) {
    return false;
  }

  if (typeof t.description !== 'string' || t.description.trim() === '') {
    return false;
  }

  if (typeof t.date !== 'string' || !isValidISODate(t.date)) {
    return false;
  }

  if (typeof t.createdAt !== 'number' || !Number.isFinite(t.createdAt)) {
    return false;
  }

  return true;
}

export interface StorageLoadResult {
  transactions: Transaction[];
  corruptedCount: number;
  hasErrors: boolean;
}

/**
 * Safely loads transactions from LocalStorage with strict validation.
 */
export function loadStoredTransactions(): StorageLoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      return { transactions: [], corruptedCount: 0, hasErrors: false };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[SpendWise Storage] Stored data is not an array. Resetting corrupted store.');
      return { transactions: [], corruptedCount: 1, hasErrors: true };
    }

    const validTransactions: Transaction[] = [];
    let corruptedCount = 0;

    for (const item of parsed) {
      if (isValidTransaction(item)) {
        validTransactions.push(item as Transaction);
      } else {
        corruptedCount++;
      }
    }

    if (corruptedCount > 0) {
      console.warn(`[SpendWise Storage] Filtered out ${corruptedCount} corrupted transaction entries.`);
    }

    return {
      transactions: validTransactions,
      corruptedCount,
      hasErrors: corruptedCount > 0,
    };
  } catch (error) {
    console.error('[SpendWise Storage] Failed to load transactions from localStorage:', error);
    return { transactions: [], corruptedCount: 1, hasErrors: true };
  }
}

/**
 * Safely persists transactions to LocalStorage.
 */
export function saveTransactions(transactions: Transaction[]): boolean {
  try {
    // Basic verification before serialization
    if (!Array.isArray(transactions)) {
      throw new Error('Attempted to save non-array transactions');
    }
    const serialized = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, serialized);
    return true;
  } catch (error) {
    console.error('[SpendWise Storage] Failed to save transactions to localStorage:', error);
    return false;
  }
}

/**
 * Clears all transaction data from LocalStorage.
 */
export function clearStoredTransactions(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  } catch (error) {
    console.error('[SpendWise Storage] Failed to clear transactions:', error);
  }
}

/**
 * Loads user theme preference ('dark' | 'light'). Defaults to 'dark'.
 */
export function loadThemePreference(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return 'dark';
}

/**
 * Saves theme preference ('dark' | 'light').
 */
export function saveThemePreference(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Checks if the application has ever been initialized.
 */
export function isAppInitialized(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED) === 'true';
  } catch {
    return false;
  }
}

export function setAppInitialized(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
  } catch {
    // Ignore
  }
}

/**
 * Estimates storage usage in bytes for diagnostic purposes in Settings.
 */
export function getStorageDiagnostics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]';
    const bytes = new Blob([raw]).size;
    const count = (JSON.parse(raw) as unknown[]).length;
    return {
      bytes,
      formattedSize: bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`,
      count,
    };
  } catch {
    return {
      bytes: 0,
      formattedSize: '0 B',
      count: 0,
    };
  }
}
