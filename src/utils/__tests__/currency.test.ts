import { describe, it, expect } from 'vitest';
import {
  rupeesToPaise,
  paiseToRupees,
  formatINR,
  validateAmount,
} from '../currency';

describe('Currency and Amount Validation Utilities', () => {
  it('converts rupees to paise accurately without floating-point inaccuracies', () => {
    expect(rupeesToPaise('100.50')).toBe(10050);
    expect(rupeesToPaise(12.99)).toBe(1299);
    expect(rupeesToPaise('0.10')).toBe(10);
    expect(rupeesToPaise(500)).toBe(50000);
    expect(rupeesToPaise('1,250.75')).toBe(125075);
  });

  it('converts paise back to rupees', () => {
    expect(paiseToRupees(10050)).toBe(100.5);
    expect(paiseToRupees(1299)).toBe(12.99);
    expect(paiseToRupees(0)).toBe(0);
  });

  it('formats INR correctly in Indian locale format', () => {
    const formatted = formatINR(1250000); // ₹12,500.00
    // Check that it contains ₹ and 12,500
    expect(formatted).toContain('12,500');
    expect(formatted).toContain('₹');

    // Test sign formatting
    const incomeFormatted = formatINR(500000, { showSign: true, type: 'income' });
    expect(incomeFormatted.startsWith('+')).toBe(true);

    const expenseFormatted = formatINR(300000, { showSign: true, type: 'expense' });
    expect(expenseFormatted.startsWith('-')).toBe(true);
  });

  it('strictly validates user input amounts', () => {
    // Valid cases
    expect(validateAmount('500').valid).toBe(true);
    expect(validateAmount('1250.50').valid).toBe(true);
    expect(validateAmount(99.99).valid).toBe(true);

    // Invalid: Zero or Negative
    expect(validateAmount('0').valid).toBe(false);
    expect(validateAmount('-50').valid).toBe(false);

    // Invalid: Empty or whitespace
    expect(validateAmount('').valid).toBe(false);
    expect(validateAmount('   ').valid).toBe(false);

    // Invalid: Non-numeric strings
    expect(validateAmount('abc').valid).toBe(false);
    expect(validateAmount('12.34.56').valid).toBe(false);

    // Invalid: More than 2 decimal places (fractional paise)
    expect(validateAmount('10.999').valid).toBe(false);
  });
});
