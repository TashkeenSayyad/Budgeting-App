import { describe, expect, it } from 'vitest';
import { applyRules } from '../apps/desktop/src/domain/services/ruleEngine';

describe('rule engine', () => {
  it('applies matching rule category', () => {
    const tx = { id:'1',accountId:'a',dateISO:'2024-01-01',amountMinor:-100, payee:'Coffee Shop', note:'', tagsJson:'[]', cleared:false, createdAt:'', updatedAt:'' };
    const out = applyRules(tx, [{ id:'r', name:'coffee', matchPayeeContains:'coffee', setCategoryId:'food', enabled:true, priority:1 }]);
    expect(out.categoryId).toBe('food');
  });
});
