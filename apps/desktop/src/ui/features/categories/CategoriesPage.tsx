import { useQuery } from '@tanstack/react-query';

export function CategoriesPage() {
  const categories = useQuery({ queryKey: ['categories'], queryFn: async () => (await window.api.v1.categories.list()).ok ? (await window.api.v1.categories.list()).data : [] });
  return (
    <div>
      <h2 className="text-xl">Categories</h2>
      <p className="text-slate-300">Uncategorized transactions are highlighted in Transactions for quick fixing.</p>
      <ul>{(categories.data ?? []).map((c) => <li key={c.id}>{c.name}</li>)}</ul>
    </div>
  );
}
