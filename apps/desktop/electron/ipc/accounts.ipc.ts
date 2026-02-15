import { ipcMain } from 'electron';
import { randomUUID } from 'node:crypto';
import { accountInputSchema } from '../../src/domain/validation/schemas';
import { ok, fail } from './helpers';

export function registerAccountsIpc(repo: any) {
  ipcMain.handle('v1.accounts.list', () => ok(repo.list()));
  ipcMain.handle('v1.accounts.create', (_e, payload) => {
    const parsed = accountInputSchema.safeParse(payload);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Invalid account');
    const now = new Date().toISOString();
    return ok(repo.create({ id: randomUUID(), ...parsed.data, createdAt: now, updatedAt: now }));
  });
}
