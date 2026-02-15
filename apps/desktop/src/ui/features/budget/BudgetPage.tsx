import { FormEvent, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface FixedCostField {
  key: string;
  label: string;
  value: string;
}

const defaultFixedCosts: FixedCostField[] = [
  { key: 'rent', label: 'Rent / Mortgage', value: '' },
  { key: 'utilities', label: 'Utilities', value: '' },
  { key: 'insurance', label: 'Insurance', value: '' },
  { key: 'internet', label: 'Internet / Phone', value: '' }
];

const variableBudgetWeights = [
  { key: 'groceries', label: 'Groceries', share: 0.35 },
  { key: 'restaurants', label: 'Restaurants', share: 0.15 },
  { key: 'shopping', label: 'Shopping', share: 0.2 },
  { key: 'transport', label: 'Transport', share: 0.1 },
  { key: 'fun', label: 'Leisure', share: 0.1 },
  { key: 'buffer', label: 'Buffer / Savings', share: 0.1 }
];

function parseAmountToMinor(value: string) {
  const parsed = Math.round(Number(value.replace(',', '.')) * 100);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMinor(minor: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(minor / 100);
}

function budgetId(month: string, key: string) {
  return `${month}-${key}`;
}

export function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [incomeInput, setIncomeInput] = useState('');
  const [fixedCosts, setFixedCosts] = useState(defaultFixedCosts);
  const qc = useQueryClient();

  const budget = useQuery({
    queryKey: ['budget', month],
    queryFn: async () => {
      const result = await window.api.v1.budget.month(month);
      return result.ok ? result.data : [];
    }
  });

  const incomeMinor = parseAmountToMinor(incomeInput);
  const totalFixedMinor = useMemo(() => fixedCosts.reduce((sum, item) => sum + parseAmountToMinor(item.value), 0), [fixedCosts]);
  const variablePoolMinor = Math.max(incomeMinor - totalFixedMinor, 0);

  const generatedPlan = useMemo(() => {
    const fixedPlan = fixedCosts
      .map((item) => ({ key: item.key, categoryId: item.label, plannedMinor: parseAmountToMinor(item.value) }))
      .filter((item) => item.plannedMinor > 0);

    const variablePlan = variableBudgetWeights.map((bucket, index) => {
      if (index === variableBudgetWeights.length - 1) {
        const allocatedSoFar = variableBudgetWeights
          .slice(0, -1)
          .reduce((sum, current) => sum + Math.floor(variablePoolMinor * current.share), 0);
        return { key: bucket.key, categoryId: bucket.label, plannedMinor: Math.max(variablePoolMinor - allocatedSoFar, 0) };
      }
      return { key: bucket.key, categoryId: bucket.label, plannedMinor: Math.floor(variablePoolMinor * bucket.share) };
    });

    return [...fixedPlan, ...variablePlan];
  }, [fixedCosts, variablePoolMinor]);

  async function createAutomaticBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (incomeMinor <= 0 || generatedPlan.length === 0) return;

    await Promise.all(
      generatedPlan.map((item) =>
        window.api.v1.budget.upsert({
          id: budgetId(month, item.key),
          monthYYYYMM: month,
          categoryId: item.categoryId,
          plannedMinor: item.plannedMinor
        })
      )
    );

    qc.invalidateQueries({ queryKey: ['budget', month] });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Budget autopilot</h2>
        <p className="text-sm text-slate-300">Enter your monthly income once, add fixed costs, and the app builds a realistic budget for you.</p>
      </div>

      <form onSubmit={createAutomaticBudget} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="grid gap-2 md:grid-cols-[auto_1fr] md:items-center">
          <label htmlFor="month" className="text-sm text-slate-300">Budget month</label>
          <input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-fit rounded border border-slate-700 bg-slate-800 px-2 py-1" />
        </div>

        <div className="grid gap-2 md:grid-cols-[auto_1fr] md:items-center">
          <label htmlFor="income" className="text-sm text-slate-300">Monthly income</label>
          <input
            id="income"
            value={incomeInput}
            onChange={(e) => setIncomeInput(e.target.value)}
            placeholder="e.g. 3200"
            className="rounded border border-slate-700 bg-slate-800 px-3 py-2"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-200">Fixed monthly costs</p>
          <div className="grid gap-2 md:grid-cols-2">
            {fixedCosts.map((item, index) => (
              <label key={item.key} className="flex flex-col gap-1 text-xs text-slate-300">
                {item.label}
                <input
                  value={item.value}
                  onChange={(e) => {
                    const next = [...fixedCosts];
                    next[index] = { ...item, value: e.target.value };
                    setFixedCosts(next);
                  }}
                  placeholder="0"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 p-3 text-sm">
          <p>Income: <strong>{formatMinor(incomeMinor)}</strong></p>
          <p>Fixed costs: <strong>{formatMinor(totalFixedMinor)}</strong></p>
          <p>Auto-allocated variable budget: <strong>{formatMinor(variablePoolMinor)}</strong></p>
        </div>

        <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400">
          Create automatic budget
        </button>
      </form>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Preview</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {generatedPlan.map((item) => (
            <li key={item.key} className="flex items-center justify-between border-b border-slate-800 py-1">
              <span>{item.categoryId}</span>
              <span>{formatMinor(item.plannedMinor)}</span>
            </li>
          ))}
        </ul>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Category</th>
            <th className="text-left">Planned</th>
            <th className="text-left">Actual</th>
            <th className="text-left">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {(budget.data ?? []).map((r) => (
            <tr key={r.categoryId}>
              <td>{r.categoryId}</td>
              <td>{formatMinor(r.plannedMinor)}</td>
              <td>{formatMinor(r.actualMinor)}</td>
              <td>{formatMinor(r.plannedMinor - r.actualMinor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
