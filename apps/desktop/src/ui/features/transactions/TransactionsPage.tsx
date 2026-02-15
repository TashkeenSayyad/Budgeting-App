import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ROW_HEIGHT = 50;

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amountMinor / 100);
}

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickPayee, setQuickPayee] = useState('');
  const parentRef = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  const accountsQuery = useQuery({
    queryKey: ['accounts-for-onboarding'],
    queryFn: async () => {
      const result = await window.api.v1.accounts.list();
      return result.ok ? result.data : [];
    }
  });

  const txQuery = useQuery({
    queryKey: ['transactions', debounced],
    queryFn: async () => {
      const result = await window.api.v1.transactions.list({ search: debounced });
      return result.ok ? result.data : [];
    }
  });

  const rows = txQuery.data ?? [];
  const selectedAccountId = accountsQuery.data?.[0]?.id;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === '/') {
        event.preventDefault();
        document.getElementById('tx-search')?.focus();
      }
      if (event.key === 'c' && selected) {
        window.api.v1.transactions.toggleCleared(selected).then(() => qc.invalidateQueries({ queryKey: ['transactions'] }));
      }
      if (event.key === 'Delete' && selected) {
        window.api.v1.transactions.delete(selected).then(() => qc.invalidateQueries({ queryKey: ['transactions'] }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [qc, selected]);

  const stats = useMemo(() => {
    const spent = rows.filter((row) => row.amountMinor < 0).reduce((sum, row) => sum + row.amountMinor, 0);
    const income = rows.filter((row) => row.amountMinor > 0).reduce((sum, row) => sum + row.amountMinor, 0);
    const uncleared = rows.filter((row) => !row.cleared).length;
    return { spent, income, uncleared };
  }, [rows]);

  async function handleQuickAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAccountId || !quickAmount) return;

    const parsedAmount = Math.round(Number(quickAmount.replace(',', '.')) * 100);
    if (!Number.isFinite(parsedAmount) || parsedAmount === 0) return;

    await window.api.v1.transactions.upsert({
      accountId: selectedAccountId,
      amountMinor: parsedAmount,
      dateISO: new Date().toISOString().slice(0, 10),
      payee: quickPayee || 'Quick entry',
      note: 'Added from quick add',
      cleared: false
    });

    setQuickAmount('');
    setQuickPayee('');
    qc.invalidateQueries({ queryKey: ['transactions'] });
  }

  if ((accountsQuery.data ?? []).length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-2xl font-semibold">Let&apos;s get you started</h2>
        <p className="mt-2 text-slate-300">Add your first account to unlock quick transaction entry and instant spending insights.</p>
        <div className="mt-4">
          <Link className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400" to="/accounts">
            Create first account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{formatMoney(stats.income)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Spending</p>
          <p className="mt-2 text-2xl font-semibold text-rose-300">{formatMoney(stats.spent)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Needs review</p>
          <p className="mt-2 text-2xl font-semibold">{stats.uncleared} transactions</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick add</h3>
          <p className="text-xs text-slate-400">Fast capture like mobile finance apps</p>
        </div>
        <form className="grid gap-2 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleQuickAdd}>
          <input
            placeholder="Amount (e.g. -12.90 or 2500)"
            value={quickAmount}
            onChange={(e) => setQuickAmount(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          />
          <input
            placeholder="Payee (optional)"
            value={quickPayee}
            onChange={(e) => setQuickPayee(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          />
          <button className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400" type="submit">
            Add transaction
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <input
            id="tx-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payee, note, category..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 md:w-[28rem]"
          />
          <div className="text-sm text-slate-400">{rows.length} results</div>
        </div>

        <div ref={parentRef} className="h-[52vh] overflow-auto rounded-xl border border-slate-800">
          <div className="sticky top-0 grid grid-cols-5 bg-slate-800 px-3 py-2 text-xs uppercase tracking-wide text-slate-300">
            <span>Date</span>
            <span>Payee</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Cleared</span>
          </div>
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((item) => {
              const row = rows[item.index];
              return (
                <button
                  key={row.id}
                  onClick={() => setSelected(row.id)}
                  className={`absolute left-0 grid w-full grid-cols-5 border-b border-slate-800 px-3 text-left text-sm transition ${selected === row.id ? 'bg-indigo-500/20' : 'hover:bg-slate-800/60'}`}
                  style={{ transform: `translateY(${item.start}px)`, height: `${item.size}px` }}
                >
                  <span>{row.dateISO}</span>
                  <span className="truncate pr-2">{row.payee || '—'}</span>
                  <span className="truncate pr-2">{row.categoryId ?? 'Uncategorized'}</span>
                  <span className={row.amountMinor < 0 ? 'text-rose-300' : 'text-emerald-300'}>{formatMoney(row.amountMinor)}</span>
                  <span>{row.cleared ? '✓' : '•'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
