import { contextBridge, ipcRenderer } from 'electron';
import type { ApiV1 } from '../src/shared/ipcTypes';

const api: { v1: ApiV1 } = {
  v1: {
    accounts: {
      list: () => ipcRenderer.invoke('v1.accounts.list'),
      create: (payload) => ipcRenderer.invoke('v1.accounts.create', payload)
    },
    categories: {
      list: () => ipcRenderer.invoke('v1.categories.list'),
      saveOrder: (ids) => ipcRenderer.invoke('v1.categories.saveOrder', ids)
    },
    transactions: {
      list: (filters) => ipcRenderer.invoke('v1.transactions.list', filters),
      upsert: (payload) => ipcRenderer.invoke('v1.transactions.upsert', payload),
      delete: (id) => ipcRenderer.invoke('v1.transactions.delete', id),
      toggleCleared: (id) => ipcRenderer.invoke('v1.transactions.toggleCleared', id)
    },
    budget: {
      month: (m) => ipcRenderer.invoke('v1.budget.month', m),
      upsert: (payload) => ipcRenderer.invoke('v1.budget.upsert', payload)
    },
    rules: {
      list: () => ipcRenderer.invoke('v1.rules.list'),
      upsert: (rule) => ipcRenderer.invoke('v1.rules.upsert', rule),
      test: (id) => ipcRenderer.invoke('v1.rules.test', id)
    },
    importExport: {
      importCsv: (payload) => ipcRenderer.invoke('v1.importExport.importCsv', payload),
      exportCsv: (filters) => ipcRenderer.invoke('v1.importExport.exportCsv', filters)
    },
    backups: {
      exportDatabase: () => ipcRenderer.invoke('v1.backups.exportDatabase'),
      restoreDatabase: (path) => ipcRenderer.invoke('v1.backups.restoreDatabase', path)
    }
  }
};

contextBridge.exposeInMainWorld('api', api);
