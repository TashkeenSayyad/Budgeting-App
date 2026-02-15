import { describe, expect, it } from 'vitest';
import { money } from '../apps/desktop/src/domain/money';

describe('money', () => {
  it('keeps minor-unit arithmetic exact', () => {
    expect(money.add(105, 95)).toBe(200);
    expect(money.subtract(200, 99)).toBe(101);
  });
});
