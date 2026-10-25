/**
 * Currency utilities for SpendWise.
 * All monetary amounts in the internal state are stored as INTEGER PAISE (1 INR = 100 paise)
 * to strictly prevent floating point rounding inaccuracies.
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrFormatterNoDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Converts a rupee amount (number or string) into integer paise.
 * Throws or returns 0 if invalid.
 */
export function rupeesToPaise(rupees: number | string): number {
  if (typeof rupees === 'string') {
    const cleaned = rupees.trim().replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    if (!Number.isFinite(parsed) || isNaN(parsed)) {
      throw new Error('Invalid numeric value');
    }
    return Math.round(parsed * 100);
  }

  if (!Number.isFinite(rupees) || isNaN(rupees)) {
    throw new Error('Invalid numeric value');
  }

  return Math.round(rupees * 100);
}

/**
 * Converts integer paise into rupees (as floating number for display/export).
 */
export function paiseToRupees(paise: number): number {
  if (!Number.isFinite(paise) || isNaN(paise)) return 0;
  return paise / 100;
}

export interface FormatOptions {
  showSign?: boolean;
  type?: 'income' | 'expense';
  compact?: boolean;
  hideDecimalsIfWhole?: boolean;
}

/**
 * Formats integer paise into a standard INR string (e.g. ₹12,500.00).
 */
export function formatINR(paise: number, options: FormatOptions = {}): string {
  if (!Number.isFinite(paise) || isNaN(paise)) {
    return '₹0.00';
  }

  const { showSign = false, type, compact = false, hideDecimalsIfWhole = false } = options;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  let formatted = '';
  if (compact) {
    formatted = inrCompactFormatter.format(rupees);
  } else if (hideDecimalsIfWhole && absPaise % 100 === 0) {
    formatted = inrFormatterNoDecimals.format(rupees);
  } else {
    formatted = inrFormatter.format(rupees);
  }

  if (showSign) {
    if (type === 'income') {
      return `+${formatted}`;
    } else if (type === 'expense') {
      return `-${formatted}`;
    } else if (paise > 0) {
      return `+${formatted}`;
    } else if (paise < 0) {
      return `-${formatted}`;
    }
  }

  if (paise < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

export interface ValidationResult {
  valid: boolean;
  paise: number;
  error?: string;
}

/**
 * Strictly validates an amount input from user forms.
 * Rejects zero, negative, NaN, non-finite, multiple dots, and unreasonable numbers.
 */
export function validateAmount(input: string | number): ValidationResult {
  if (input === '' || input === null || input === undefined) {
    return { valid: false, paise: 0, error: 'Amount is required' };
  }

  const str = typeof input === 'string' ? input.trim().replace(/,/g, '') : String(input);

  // Strict regex pattern: only positive numbers with up to 2 decimal places
  const numberRegex = /^\d+(\.\d{1,2})?$/;
  if (!numberRegex.test(str)) {
    return {
      valid: false,
      paise: 0,
      error: 'Please enter a valid positive amount (e.g. 500 or 1250.50)',
    };
  }

  const num = parseFloat(str);

  if (!Number.isFinite(num) || isNaN(num) || num <= 0) {
    return { valid: false, paise: 0, error: 'Amount must be greater than ₹0' };
  }

  // Max limit for sanity: ₹100 Crores (1,000,000,000)
  if (num > 1000000000) {
    return { valid: false, paise: 0, error: 'Amount exceeds the maximum limit (₹100 Cr)' };
  }

  const paise = Math.round(num * 100);

  return { valid: true, paise };
}
