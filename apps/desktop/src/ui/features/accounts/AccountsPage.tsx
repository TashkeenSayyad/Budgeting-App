import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function AccountsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: async () => (await window.api.v1.accounts.list()).ok ? (await window.api.v1.accounts.list()).data : [] });

  return (
    <div className="space-y-3">
      <h2 className="text-xl">Accounts</h2>
      <div className="rounded border border-slate-700 p-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Account name" className="rounded bg-slate-800 px-2 py-1" />
        <button
          className="ml-2 rounded bg-indigo-600 px-3 py-1"
          onClick={async () => {
            await window.api.v1.accounts.create({ name, currency: 'USD', type: 'checking', initialBalanceMinor: 0 });
            setName('');
            qc.invalidateQueries({ queryKey: ['accounts'] });
          }}
        >
          Add
        </button>
      </div>
      <ul>{(accounts.data ?? []).map((a) => <li key={a.id}>{a.name}</li>)}</ul>
    </div>
  );
}
