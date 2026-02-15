import { ipcMain } from 'electron';
import { ok } from './helpers';

export function registerBudgetIpc(repo: any) {
  ipcMain.handle('v1.budget.month', (_e, month) => ok(repo.month(month)));
  ipcMain.handle('v1.budget.upsert', (_e, payload) => ok(repo.upsert(payload)));
}
