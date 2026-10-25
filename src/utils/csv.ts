import { Transaction } from '../types';
import { paiseToRupees } from './currency';
import { getTodayISO } from './date';

/**
 * Escapes a field for CSV according to RFC 4180.
 * If the field contains comma, quote, or newline, it must be enclosed in double quotes,
 * and any inner double quotes must be doubled ("").
 */
function escapeCSVField(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts a list of transactions to standard RFC 4180 CSV string.
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    'Transaction ID',
    'Date',
    'Description',
    'Category',
    'Type',
    'Amount (INR)',
    'Amount (Paise)',
  ];

  const rows = transactions.map((t) => {
    const rupees = paiseToRupees(t.amount).toFixed(2);
    return [
      escapeCSVField(t.id),
      escapeCSVField(t.date),
      escapeCSVField(t.description),
      escapeCSVField(t.category),
      escapeCSVField(t.type.toUpperCase()),
      escapeCSVField(rupees),
      escapeCSVField(t.amount),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Initiates a browser download for the transactions CSV file.
 */
export function exportTransactionsToCSV(transactions: Transaction[]): boolean {
  try {
    if (transactions.length === 0) {
      return false;
    }

    const csvContent = transactionsToCSV(transactions);
    // Add BOM for proper UTF-8 Excel support
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateStr = getTodayISO();
    link.setAttribute('href', url);
    link.setAttribute('download', `spendwise-transactions-${dateStr}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('[SpendWise Export] Failed to export transactions:', error);
    return false;
  }
}
