import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { app } from 'electron';

export function createDb() {
  const userData = app.getPath('userData');
  const dbPath = path.join(userData, 'budgeting.sqlite');
  fs.mkdirSync(userData, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  runMigrations(db);
  return { db, dbPath };
}

function runMigrations(db: Database.Database) {
  const migrationDir = path.join(process.cwd(), 'apps/desktop/src/data/migrations');
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY)');
  const files = fs.readdirSync(migrationDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const seen = db.prepare('SELECT id FROM schema_migrations WHERE id = ?').get(file);
    if (!seen) {
      db.exec(fs.readFileSync(path.join(migrationDir, file), 'utf8'));
      db.prepare('INSERT INTO schema_migrations (id) VALUES (?)').run(file);
    }
  }
}
