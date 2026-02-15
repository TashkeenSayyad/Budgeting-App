import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { createDb } from '../src/data/db';
import { AccountsRepo } from '../src/data/repositories/accounts.repo';
import { CategoriesRepo } from '../src/data/repositories/categories.repo';
import { TransactionsRepo } from '../src/data/repositories/transactions.repo';
import { BudgetRepo } from '../src/data/repositories/budget.repo';
import { RulesRepo } from '../src/data/repositories/rules.repo';
import { BackupsRepo } from '../src/data/repositories/backups.repo';
import { registerAccountsIpc } from './ipc/accounts.ipc';
import { registerCategoriesIpc } from './ipc/categories.ipc';
import { registerTransactionsIpc } from './ipc/transactions.ipc';
import { registerBudgetIpc } from './ipc/budget.ipc';
import { registerRulesIpc } from './ipc/rules.ipc';
import { registerImportExportIpc } from './ipc/importExport.ipc';
import { registerBackupsIpc } from './ipc/backups.ipc';

if (require('electron-squirrel-startup')) app.quit();

const { db, dbPath } = createDb();
const accountsRepo = new AccountsRepo(db);
const categoriesRepo = new CategoriesRepo(db);
const transactionsRepo = new TransactionsRepo(db);
const budgetRepo = new BudgetRepo(db);
const rulesRepo = new RulesRepo(db);
const backupsRepo = new BackupsRepo(dbPath);

registerAccountsIpc(accountsRepo);
registerCategoriesIpc(categoriesRepo);
registerTransactionsIpc(transactionsRepo);
registerBudgetIpc(budgetRepo);
registerRulesIpc(rulesRepo, transactionsRepo);
registerImportExportIpc(transactionsRepo);
registerBackupsIpc(backupsRepo);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(() => {
  if (process.env.NODE_ENV === 'development') {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: 'Developer',
          submenu: [{ label: 'Seed demo data', click: () => console.info('Seed demo data TODO') }]
        }
      ])
    );
  }
  createWindow();
});
