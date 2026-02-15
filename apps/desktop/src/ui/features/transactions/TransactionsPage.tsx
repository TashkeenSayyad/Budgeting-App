import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ROW_HEIGHT = 42;

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 200);
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

  const total = useMemo(() => rows.reduce((sum, row) => sum + row.amountMinor, 0), [rows]);

  if ((accountsQuery.data ?? []).length === 0) {
    return (
      <div className="rounded border border-slate-700 p-6">
        <h2 className="text-2xl font-semibold">Welcome — create your first account</h2>
        <p className="mt-2 text-slate-300">2-minute onboarding: add account, optional starter categories, then import CSV or add a transaction.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <input
          id="tx-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search payee/note (press /)"
          className="w-96 rounded bg-slate-800 px-3 py-2"
        />
        <div className="text-sm text-slate-300">Loaded: {rows.length} rows | Net {total / 100}</div>
      </div>
      <div ref={parentRef} className="h-[70vh] overflow-auto rounded border border-slate-700">
        <div className="sticky top-0 grid grid-cols-5 bg-slate-800 px-2 py-2 text-xs uppercase text-slate-300">
          <span>Date</span><span>Payee</span><span>Category</span><span>Amount</span><span>Cleared</span>
        </div>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index];
            return (
              <button
                key={row.id}
                onClick={() => setSelected(row.id)}
                className={`absolute left-0 grid w-full grid-cols-5 px-2 text-left text-sm ${selected === row.id ? 'bg-indigo-500/20' : ''}`}
                style={{ transform: `translateY(${item.start}px)`, height: `${item.size}px` }}
              >
                <span>{row.dateISO}</span><span>{row.payee}</span><span>{row.categoryId ?? 'Uncategorized'}</span><span>{row.amountMinor / 100}</span><span>{row.cleared ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
