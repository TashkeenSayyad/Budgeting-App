import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Transactions', emoji: '💸' },
  { to: '/accounts', label: 'Accounts', emoji: '🏦' },
  { to: '/categories', label: 'Categories', emoji: '🗂️' },
  { to: '/budget', label: 'Budget', emoji: '🎯' },
  { to: '/rules', label: 'Rules', emoji: '⚙️' },
  { to: '/import-export', label: 'Import / Export', emoji: '📥' },
  { to: '/settings', label: 'Settings', emoji: '🔧' }
];

export function Layout() {
  return (
    <div className="grid h-screen grid-cols-[270px_1fr] bg-slate-950 text-slate-100">
      <aside className="flex flex-col border-r border-slate-800 bg-slate-900/70 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Budgeting App</p>
        <h1 className="mt-2 text-2xl font-semibold">Money made simple</h1>
        <p className="mt-2 text-sm text-slate-300">Track spending, stay on budget, and get clarity in minutes.</p>

        <nav className="mt-6 flex flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                  isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span aria-hidden>{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3 text-xs text-indigo-100">
          <p className="font-semibold">Pro tip</p>
          <p className="mt-1 text-indigo-100/90">Press <kbd className="rounded bg-indigo-300/30 px-1 py-0.5">/</kbd> to search transactions instantly.</p>
        </div>
      </aside>
      <main className="overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 p-3">
          <input
            id="global-search"
            placeholder="Search transactions, payees, categories..."
            className="w-[28rem] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Month</span>
            <input type="month" className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1" />
          </div>
        </header>
        <div className="h-[calc(100vh-57px)] overflow-auto p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
