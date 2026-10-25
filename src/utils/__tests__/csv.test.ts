import { describe, it, expect } from 'vitest';
import { transactionsToCSV } from '../csv';
import { Transaction } from '../../types';

describe('CSV Generation Utility', () => {
  it('correctly creates RFC 4180 CSV with headers and formatted rupee amounts', () => {
    const transactions: Transaction[] = [
      {
        id: 'tx-1',
        date: '2025-03-01',
        description: 'Salary, Tech Corp',
        category: 'Salary',
        type: 'income',
        amount: 8500000, // ₹85,000.00
        createdAt: 1000,
      },
      {
        id: 'tx-2',
        date: '2025-03-02',
        description: 'Dinner at "Bistro"',
        category: 'Food',
        type: 'expense',
        amount: 145000, // ₹1,450.00
        createdAt: 2000,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const lines = csv.split('\r\n');

    expect(lines[0]).toBe(
      'Transaction ID,Date,Description,Category,Type,Amount (INR),Amount (Paise)'
    );

    // Check line 1: Description contains comma, must be wrapped in quotes
    expect(lines[1]).toContain('"Salary, Tech Corp"');
    expect(lines[1]).toContain('85000.00');

    // Check line 2: Description contains double quotes, must be escaped as ""
    expect(lines[2]).toContain('"Dinner at ""Bistro"""');
    expect(lines[2]).toContain('1450.00');
  });

  it('handles empty transaction list by returning only header row', () => {
    const csv = transactionsToCSV([]);
    expect(csv).toBe(
      'Transaction ID,Date,Description,Category,Type,Amount (INR),Amount (Paise)'
    );
  });
});
