import { ipcMain } from 'electron';
import { ok } from './helpers';

export function registerImportExportIpc(txRepo: any) {
  ipcMain.handle('v1.importExport.importCsv', (_e, payload) => {
    const rows = payload.csv.split('\n').slice(1).filter(Boolean);
    let inserted = 0;
    rows.forEach((line: string, index: number) => {
      const [dateISO, amount, payee, note] = line.split(',');
      txRepo.upsert({
        id: `${payload.accountId}-csv-${index}-${dateISO}`,
        accountId: payload.accountId,
        dateISO,
        amountMinor: Number(amount),
        payee: payee ?? '',
        note: note ?? '',
        tagsJson: '[]',
        cleared: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      inserted += 1;
    });
    return ok({ inserted, skipped: 0 });
  });

  ipcMain.handle('v1.importExport.exportCsv', (_e, filters) => {
    const rows = txRepo.list(filters);
    const csv = ['dateISO,amountMinor,payee,note,categoryId'].concat(rows.map((r: any) => `${r.dateISO},${r.amountMinor},${r.payee},${r.note},${r.categoryId ?? ''}`));
    return ok(csv.join('\n'));
  });
}
