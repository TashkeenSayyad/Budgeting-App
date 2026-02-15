import type { Transaction } from '../models';

export function aggregateActualByCategory(transactions: Transaction[], monthYYYYMM: string): Record<string, number> {
  return transactions
    .filter((tx) => tx.dateISO.startsWith(monthYYYYMM) && tx.amountMinor < 0)
    .reduce<Record<string, number>>((acc, tx) => {
      const key = tx.categoryId ?? 'uncategorized';
      acc[key] = (acc[key] ?? 0) + Math.abs(tx.amountMinor);
      return acc;
    }, {});
}
