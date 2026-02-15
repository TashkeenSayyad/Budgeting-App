import type Database from 'better-sqlite3';
import type { Account } from '../../domain/models';

export class AccountsRepo {
  constructor(private readonly db: Database.Database) {}

  list(): Account[] {
    return this.db.prepare('SELECT * FROM accounts ORDER BY createdAt DESC').all() as Account[];
  }

  create(input: Account): Account {
    this.db
      .prepare(
        'INSERT INTO accounts(id,name,type,currency,initialBalanceMinor,createdAt,updatedAt) VALUES (@id,@name,@type,@currency,@initialBalanceMinor,@createdAt,@updatedAt)'
      )
      .run(input);
    return input;
  }
}
