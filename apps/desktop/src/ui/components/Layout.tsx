import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr] bg-slate-900 text-slate-100">
      <aside className="border-r border-slate-700 p-4">
        <h1 className="text-lg font-semibold">Budgeting</h1>
        <nav className="mt-4 flex flex-col gap-2 text-sm">
          <Link to="/">Transactions</Link>
          <Link to="/accounts">Accounts</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/rules">Rules</Link>
          <Link to="/import-export">Import/Export</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </aside>
      <main className="overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-700 p-3">
          <input id="global-search" placeholder="Search transactions..." className="w-80 rounded bg-slate-800 px-3 py-2" />
          <input type="month" className="rounded bg-slate-800 px-2 py-1" />
        </header>
        <div className="h-[calc(100vh-57px)] overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
