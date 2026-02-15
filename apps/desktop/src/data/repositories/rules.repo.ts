import type Database from 'better-sqlite3';
import type { Rule } from '../../domain/models';

export class RulesRepo {
  constructor(private readonly db: Database.Database) {}

  list() {
    return this.db.prepare('SELECT * FROM rules ORDER BY priority ASC').all() as Rule[];
  }

  upsert(rule: Rule) {
    this.db
      .prepare('INSERT INTO rules(id,name,matchPayeeContains,matchNoteContains,setCategoryId,setTagsJson,enabled,priority) VALUES (@id,@name,@matchPayeeContains,@matchNoteContains,@setCategoryId,@setTagsJson,@enabled,@priority) ON CONFLICT(id) DO UPDATE SET name=excluded.name,matchPayeeContains=excluded.matchPayeeContains,matchNoteContains=excluded.matchNoteContains,setCategoryId=excluded.setCategoryId,setTagsJson=excluded.setTagsJson,enabled=excluded.enabled,priority=excluded.priority')
      .run({ ...rule, enabled: Number(rule.enabled) });
    return rule;
  }
}
