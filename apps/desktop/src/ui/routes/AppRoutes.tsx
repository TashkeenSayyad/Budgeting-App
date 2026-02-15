import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { TransactionsPage } from '../features/transactions/TransactionsPage';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { CategoriesPage } from '../features/categories/CategoriesPage';
import { BudgetPage } from '../features/budget/BudgetPage';
import { RulesPage } from '../features/rules/RulesPage';
import { ImportExportPage } from '../features/importExport/ImportExportPage';
import { SettingsPage } from '../features/settings/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/import-export" element={<ImportExportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
