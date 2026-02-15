import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const budget = useQuery({ queryKey: ['budget', month], queryFn: async () => (await window.api.v1.budget.month(month)).ok ? (await window.api.v1.budget.month(month)).data : [] });
  return (
    <div>
      <h2 className="text-xl">Budget</h2>
      <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded bg-slate-800 px-2 py-1" />
      <table className="mt-3 w-full text-sm"><thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th>Remaining</th></tr></thead><tbody>
      {(budget.data ?? []).map((r) => <tr key={r.categoryId}><td>{r.categoryId}</td><td>{r.plannedMinor/100}</td><td>{r.actualMinor/100}</td><td>{(r.plannedMinor-r.actualMinor)/100}</td></tr>)}
      </tbody></table>
    </div>
  );
}
