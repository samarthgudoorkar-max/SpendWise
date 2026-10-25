import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadStoredTransactions,
  saveTransactions,
  clearStoredTransactions,
} from '../storage';
import { Transaction } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage Persistence & Safety', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('persists and retrieves valid transactions safely', () => {
    const valid: Transaction[] = [
      {
        id: 'tx-100',
        type: 'income',
        amount: 500000,
        category: 'Salary',
        description: 'Valid Salary',
        date: '2025-03-01',
        createdAt: 12345678,
      },
    ];

    expect(saveTransactions(valid)).toBe(true);

    const result = loadStoredTransactions();
    expect(result.hasErrors).toBe(false);
    expect(result.corruptedCount).toBe(0);
    expect(result.transactions.length).toBe(1);
    expect(result.transactions[0].id).toBe('tx-100');
    expect(result.transactions[0].amount).toBe(500000);
  });

  it('safely handles corrupted non-array JSON without crashing', () => {
    localStorageMock.setItem('spendwise_transactions_v1', '{"not": "an array"}');

    const result = loadStoredTransactions();
    expect(result.hasErrors).toBe(true);
    expect(result.transactions).toEqual([]);
  });

  it('safely filters out invalid or malformed transaction records', () => {
    const mixedData = [
      {
        id: 'valid-1',
        type: 'expense',
        amount: 25000,
        category: 'Food',
        description: 'Valid item',
        date: '2025-03-05',
        createdAt: 1000,
      },
      {
        // Missing id
        type: 'expense',
        amount: 5000,
        category: 'Food',
        description: 'No id',
        date: '2025-03-05',
        createdAt: 2000,
      },
      {
        // Negative amount (invalid)
        id: 'bad-2',
        type: 'expense',
        amount: -100,
        category: 'Bills',
        description: 'Negative amount',
        date: '2025-03-05',
        createdAt: 3000,
      },
      {
        // Non-integer paise (invalid)
        id: 'bad-3',
        type: 'expense',
        amount: 100.5,
        category: 'Bills',
        description: 'Float paise',
        date: '2025-03-05',
        createdAt: 4000,
      },
      {
        // Invalid category
        id: 'bad-4',
        type: 'expense',
        amount: 1000,
        category: 'NonExistentCategory',
        description: 'Bad cat',
        date: '2025-03-05',
        createdAt: 5000,
      },
    ];

    localStorageMock.setItem('spendwise_transactions_v1', JSON.stringify(mixedData));

    const result = loadStoredTransactions();
    expect(result.hasErrors).toBe(true);
    expect(result.corruptedCount).toBe(4);
    expect(result.transactions.length).toBe(1);
    expect(result.transactions[0].id).toBe('valid-1');
  });

  it('clears stored transactions correctly', () => {
    localStorageMock.setItem('spendwise_transactions_v1', '[]');
    clearStoredTransactions();
    expect(localStorageMock.getItem('spendwise_transactions_v1')).toBeNull();
  });
});
