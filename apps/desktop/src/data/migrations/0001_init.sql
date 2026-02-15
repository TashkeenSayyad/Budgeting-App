CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  currency TEXT NOT NULL,
  initialBalanceMinor INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  color TEXT NOT NULL,
  parentId TEXT,
  sortOrder INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  dateISO TEXT NOT NULL,
  amountMinor INTEGER NOT NULL,
  categoryId TEXT,
  payee TEXT NOT NULL,
  note TEXT NOT NULL,
  tagsJson TEXT NOT NULL,
  cleared INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS budgetMonths (
  id TEXT PRIMARY KEY,
  monthYYYYMM TEXT NOT NULL,
  categoryId TEXT NOT NULL,
  plannedMinor INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  matchPayeeContains TEXT,
  matchNoteContains TEXT,
  setCategoryId TEXT,
  setTagsJson TEXT,
  enabled INTEGER NOT NULL,
  priority INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tx_account_date ON transactions(accountId, dateISO DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category_date ON transactions(categoryId, dateISO DESC);
CREATE INDEX IF NOT EXISTS idx_tx_cleared_date ON transactions(cleared, dateISO DESC);
CREATE INDEX IF NOT EXISTS idx_tx_payee ON transactions(payee);

CREATE TABLE IF NOT EXISTS recurring (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cadence TEXT NOT NULL,
  nextDateISO TEXT NOT NULL,
  templateJson TEXT NOT NULL,
  enabled INTEGER NOT NULL
);
