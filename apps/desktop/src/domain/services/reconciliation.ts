import type { Transaction } from '../models';

export function reconcile(transactions: Transaction[]) {
  const cleared = transactions.filter((t) => t.cleared).reduce((sum, t) => sum + t.amountMinor, 0);
  const uncleared = transactions.filter((t) => !t.cleared).reduce((sum, t) => sum + t.amountMinor, 0);
  return { cleared, uncleared, current: cleared + uncleared };
}
