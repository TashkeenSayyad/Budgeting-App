import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  currency: text('currency').notNull(),
  initialBalanceMinor: integer('initialBalanceMinor').notNull(),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull()
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  kind: text('kind').notNull(),
  color: text('color').notNull(),
  parentId: text('parentId'),
  sortOrder: integer('sortOrder').notNull()
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  dateISO: text('dateISO').notNull(),
  amountMinor: integer('amountMinor').notNull(),
  categoryId: text('categoryId'),
  payee: text('payee').notNull(),
  note: text('note').notNull(),
  tagsJson: text('tagsJson').notNull(),
  cleared: integer('cleared', { mode: 'boolean' }).notNull(),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull()
});

export const budgetMonths = sqliteTable('budgetMonths', {
  id: text('id').primaryKey(),
  monthYYYYMM: text('monthYYYYMM').notNull(),
  categoryId: text('categoryId').notNull(),
  plannedMinor: integer('plannedMinor').notNull()
});

export const rules = sqliteTable('rules', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  matchPayeeContains: text('matchPayeeContains'),
  matchNoteContains: text('matchNoteContains'),
  setCategoryId: text('setCategoryId'),
  setTagsJson: text('setTagsJson'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull(),
  priority: integer('priority').notNull()
});


export const recurring = sqliteTable('recurring', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  cadence: text('cadence').notNull(),
  nextDateISO: text('nextDateISO').notNull(),
  templateJson: text('templateJson').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull()
});
