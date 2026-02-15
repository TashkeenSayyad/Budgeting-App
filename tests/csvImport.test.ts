import { describe, expect, it } from 'vitest';
import { parseAmount, parseDate } from '../apps/desktop/src/domain/services/csvImport';

describe('csv import mapping', () => {
  it('parses mm/dd/yyyy dates', () => {
    expect(parseDate('1/5/2025', 'MM/DD/YYYY')).toBe('2025-01-05');
  });
  it('supports sign inversion', () => {
    expect(parseAmount('12.34', true)).toBe(-1234);
  });
});
