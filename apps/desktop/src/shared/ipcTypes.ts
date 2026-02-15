import type { Account, Category, Transaction, BudgetMonth, Rule } from '../domain/models';
import type { Result } from './types';

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  search?: string;
  cleared?: boolean;
  fromISO?: string;
  toISO?: string;
  minAmountMinor?: number;
  maxAmountMinor?: number;
}

export interface ApiV1 {
  accounts: {
    list(): Promise<Result<Account[]>>;
    create(input: Pick<Account, 'name' | 'currency' | 'type' | 'initialBalanceMinor'>): Promise<Result<Account>>;
  };
  categories: {
    list(): Promise<Result<Category[]>>;
    saveOrder(ids: string[]): Promise<Result<void>>;
  };
  transactions: {
    list(filters: TransactionFilters): Promise<Result<Transaction[]>>;
    upsert(input: Partial<Transaction>): Promise<Result<Transaction>>;
    delete(id: string): Promise<Result<void>>;
    toggleCleared(id: string): Promise<Result<Transaction>>;
  };
  budget: {
    month(monthYYYYMM: string): Promise<Result<Array<{ categoryId: string; plannedMinor: number; actualMinor: number }>>>;
    upsert(month: BudgetMonth): Promise<Result<BudgetMonth>>;
  };
  rules: {
    list(): Promise<Result<Rule[]>>;
    upsert(rule: Rule): Promise<Result<Rule>>;
    test(ruleId: string): Promise<Result<Transaction[]>>;
  };
  importExport: {
    importCsv(payload: { accountId: string; csv: string }): Promise<Result<{ inserted: number; skipped: number }>>;
    exportCsv(filters: TransactionFilters): Promise<Result<string>>;
  };
  backups: {
    exportDatabase(): Promise<Result<string>>;
    restoreDatabase(path: string): Promise<Result<void>>;
  };
}
