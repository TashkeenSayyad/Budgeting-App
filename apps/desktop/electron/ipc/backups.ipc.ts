import { dialog, ipcMain } from 'electron';
import { ok, fail } from './helpers';

export function registerBackupsIpc(repo: any) {
  ipcMain.handle('v1.backups.exportDatabase', async () => {
    const target = await dialog.showSaveDialog({ title: 'Export database', defaultPath: 'budgeting.sqlite' });
    if (target.canceled || !target.filePath) return fail('Export cancelled');
    return ok(repo.exportTo(target.filePath));
  });
  ipcMain.handle('v1.backups.restoreDatabase', (_e, sourcePath: string) => {
    repo.restoreFrom(sourcePath);
    return ok(undefined);
  });
}
