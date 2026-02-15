import { ipcMain } from 'electron';
import { randomUUID } from 'node:crypto';
import { transactionInputSchema } from '../../src/domain/validation/schemas';
import { ok, fail } from './helpers';

export function registerTransactionsIpc(repo: any) {
  ipcMain.handle('v1.transactions.list', (_e, filters) => ok(repo.list(filters)));
  ipcMain.handle('v1.transactions.upsert', (_e, payload) => {
    const now = new Date().toISOString();
    const parsed = transactionInputSchema.safeParse(payload);
    if (!parsed.success) return fail('Invalid transaction payload');
    const tx = {
      id: parsed.data.id ?? randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...parsed.data
    };
    return ok(repo.upsert(tx));
  });
  ipcMain.handle('v1.transactions.delete', (_e, id: string) => {
    repo.delete(id);
    return ok(undefined);
  });
  ipcMain.handle('v1.transactions.toggleCleared', (_e, id: string) => ok(repo.toggleCleared(id)));
}
