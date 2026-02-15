import { useQuery } from '@tanstack/react-query';

export function RulesPage() {
  const rules = useQuery({ queryKey: ['rules'], queryFn: async () => (await window.api.v1.rules.list()).ok ? (await window.api.v1.rules.list()).data : [] });
  return <div><h2 className="text-xl">Rules</h2><ul>{(rules.data ?? []).map((r) => <li key={r.id}>{r.name}</li>)}</ul></div>;
}
