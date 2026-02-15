export function SettingsPage() {
  return (
    <div>
      <h2 className="text-xl">Settings</h2>
      <button className="rounded bg-slate-700 px-3 py-2" onClick={() => window.api.v1.backups.exportDatabase()}>
        Export database
      </button>
    </div>
  );
}
