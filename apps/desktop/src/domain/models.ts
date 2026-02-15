export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  currency: string;
  initialBalanceMinor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  kind: 'income' | 'expense';
  color: string;
  parentId?: string;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  dateISO: string;
  amountMinor: number;
  categoryId?: string;
  payee: string;
  note: string;
  tagsJson: string;
  cleared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetMonth {
  id: string;
  monthYYYYMM: string;
  categoryId: string;
  plannedMinor: number;
}

export interface Rule {
  id: string;
  name: string;
  matchPayeeContains?: string;
  matchNoteContains?: string;
  setCategoryId?: string;
  setTagsJson?: string;
  enabled: boolean;
  priority: number;
}

export interface Recurring {
  id: string;
  name: string;
  cadence: string;
  nextDateISO: string;
  templateJson: string;
  enabled: boolean;
}
