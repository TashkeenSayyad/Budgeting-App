import { ipcMain } from 'electron';
import { ok } from './helpers';

export function registerCategoriesIpc(repo: any) {
  ipcMain.handle('v1.categories.list', () => ok(repo.list()));
  ipcMain.handle('v1.categories.saveOrder', (_e, ids) => {
    repo.saveOrder(ids);
    return ok(undefined);
  });
}
