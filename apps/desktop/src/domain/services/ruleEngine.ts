import type { Rule, Transaction } from '../models';

export function applyRules(tx: Transaction, rules: Rule[]): Transaction {
  const sorted = rules.filter((rule) => rule.enabled).sort((a, b) => a.priority - b.priority);
  let updated = { ...tx };
  for (const rule of sorted) {
    const payeeOk = !rule.matchPayeeContains || updated.payee.toLowerCase().includes(rule.matchPayeeContains.toLowerCase());
    const noteOk = !rule.matchNoteContains || updated.note.toLowerCase().includes(rule.matchNoteContains.toLowerCase());
    if (payeeOk && noteOk) {
      if (rule.setCategoryId) updated.categoryId = rule.setCategoryId;
      if (rule.setTagsJson) updated.tagsJson = rule.setTagsJson;
    }
  }
  return updated;
}
