import type Database from 'better-sqlite3';
import type { Category } from '../../domain/models';

export class CategoriesRepo {
  constructor(private readonly db: Database.Database) {}

  list(): Category[] {
    return this.db.prepare('SELECT * FROM categories ORDER BY sortOrder ASC').all() as Category[];
  }

  saveOrder(ids: string[]) {
    const stmt = this.db.prepare('UPDATE categories SET sortOrder = ? WHERE id = ?');
    const tx = this.db.transaction((idList: string[]) => {
      idList.forEach((id, index) => stmt.run(index, id));
    });
    tx(ids);
  }
}
