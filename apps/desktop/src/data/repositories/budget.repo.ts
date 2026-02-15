import type Database from 'better-sqlite3';
import type { BudgetMonth } from '../../domain/models';

export class BudgetRepo {
  constructor(private readonly db: Database.Database) {}

  month(monthYYYYMM: string) {
    const sql = `
      SELECT b.categoryId as categoryId, b.plannedMinor as plannedMinor,
      COALESCE(SUM(CASE WHEN t.amountMinor < 0 THEN ABS(t.amountMinor) ELSE 0 END), 0) as actualMinor
      FROM budgetMonths b
      LEFT JOIN transactions t ON t.categoryId = b.categoryId AND substr(t.dateISO,1,7) = @month
      WHERE b.monthYYYYMM = @month
      GROUP BY b.categoryId, b.plannedMinor
      ORDER BY b.categoryId ASC
    `;
    return this.db.prepare(sql).all({ month: monthYYYYMM }) as Array<{ categoryId: string; plannedMinor: number; actualMinor: number }>;
  }

  upsert(input: BudgetMonth) {
    this.db
      .prepare('INSERT INTO budgetMonths(id,monthYYYYMM,categoryId,plannedMinor) VALUES (@id,@monthYYYYMM,@categoryId,@plannedMinor) ON CONFLICT(id) DO UPDATE SET plannedMinor=excluded.plannedMinor')
      .run(input);
    return input;
  }
}
