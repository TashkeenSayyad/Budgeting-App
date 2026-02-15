import type Database from 'better-sqlite3';
import type { Transaction } from '../../domain/models';
import type { TransactionFilters } from '../../shared/ipcTypes';

export class TransactionsRepo {
  constructor(private readonly db: Database.Database) {}

  list(filters: TransactionFilters): Transaction[] {
    const where: string[] = [];
    const args: Record<string, unknown> = {};
    if (filters.accountId) {
      where.push('accountId = @accountId');
      args.accountId = filters.accountId;
    }
    if (filters.categoryId) {
      where.push('categoryId = @categoryId');
      args.categoryId = filters.categoryId;
    }
    if (typeof filters.cleared === 'boolean') {
      where.push('cleared = @cleared');
      args.cleared = Number(filters.cleared);
    }
    if (filters.search) {
      where.push('(payee LIKE @search OR note LIKE @search)');
      args.search = `%${filters.search}%`;
    }
    if (filters.fromISO) {
      where.push('dateISO >= @fromISO');
      args.fromISO = filters.fromISO;
    }
    if (filters.toISO) {
      where.push('dateISO <= @toISO');
      args.toISO = filters.toISO;
    }
    const sql = `SELECT * FROM transactions ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY dateISO DESC LIMIT 100000`;
    return this.db.prepare(sql).all(args) as Transaction[];
  }

  upsert(input: Transaction): Transaction {
    this.db
      .prepare(
        'INSERT INTO transactions(id,accountId,dateISO,amountMinor,categoryId,payee,note,tagsJson,cleared,createdAt,updatedAt) VALUES (@id,@accountId,@dateISO,@amountMinor,@categoryId,@payee,@note,@tagsJson,@cleared,@createdAt,@updatedAt) ON CONFLICT(id) DO UPDATE SET accountId=excluded.accountId,dateISO=excluded.dateISO,amountMinor=excluded.amountMinor,categoryId=excluded.categoryId,payee=excluded.payee,note=excluded.note,tagsJson=excluded.tagsJson,cleared=excluded.cleared,updatedAt=excluded.updatedAt'
      )
      .run({ ...input, cleared: Number(input.cleared) });
    return input;
  }

  delete(id: string) {
    this.db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  }

  toggleCleared(id: string): Transaction {
    this.db.prepare('UPDATE transactions SET cleared = CASE WHEN cleared = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    return this.db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as Transaction;
  }
}
