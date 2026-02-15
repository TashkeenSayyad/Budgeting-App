import { describe, expect, it } from 'vitest';
import { aggregateActualByCategory } from '../apps/desktop/src/domain/services/budgetAggregation';

describe('budget aggregation', () => {
  it('aggregates expense absolute values', () => {
    const agg = aggregateActualByCategory([
      { id:'1',accountId:'a',dateISO:'2025-01-03',amountMinor:-200,categoryId:'food',payee:'',note:'',tagsJson:'[]',cleared:false,createdAt:'',updatedAt:'' },
      { id:'2',accountId:'a',dateISO:'2025-01-04',amountMinor:-300,categoryId:'food',payee:'',note:'',tagsJson:'[]',cleared:false,createdAt:'',updatedAt:'' }
    ], '2025-01');
    expect(agg.food).toBe(500);
  });
});
