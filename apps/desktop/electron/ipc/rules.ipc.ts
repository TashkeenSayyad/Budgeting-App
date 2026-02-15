import { ipcMain } from 'electron';
import { ok } from './helpers';
import { applyRules } from '../../src/domain/services/ruleEngine';

export function registerRulesIpc(repo: any, txRepo: any) {
  ipcMain.handle('v1.rules.list', () => ok(repo.list()));
  ipcMain.handle('v1.rules.upsert', (_e, rule) => ok(repo.upsert(rule)));
  ipcMain.handle('v1.rules.test', (_e, id: string) => {
    const rule = repo.list().find((item: any) => item.id === id);
    const last200 = txRepo.list({}).slice(0, 200);
    if (!rule) return ok([]);
    return ok(last200.map((tx: any) => applyRules(tx, [rule])));
  });
}
