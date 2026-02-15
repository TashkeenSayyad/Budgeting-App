# Budgeting App

A local-first, offline desktop budgeting app built with Electron + React + TypeScript. It targets low-friction UX, high list performance (50k+ transactions), and predictable extension points.

## Quickstart

```bash
npm install
npm run dev
```

Quality and packaging:

```bash
npm run typecheck
npm run lint
npm run test
npm run make
```

## Linux / WSL runtime dependencies

If Electron fails with a missing shared library error (for example `libnss3.so`), install the required desktop runtime packages:

```bash
sudo apt-get update
# Ubuntu 24.04+/newer Debian (t64 naming)
sudo apt-get install -y libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libgtk-3-0t64 libxss1 libasound2t64

# Older Ubuntu/Debian
sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2
```

The `npm run dev` command now runs a Linux dependency preflight check and prints this install command if required libraries are missing.

## Architecture Overview

```text
┌─────────────────────────── Electron Main (apps/desktop/electron) ───────────────────────────┐
│ - Owns SQLite connection + migrations                                                        │
│ - Registers typed, versioned IPC handlers                                                    │
│ - Handles dialogs, backups, and process-only tasks                                           │
└───────────────▲────────────────────────────────────────────────────────────────────────────────┘
                │ narrow preload bridge (contextIsolation: true, nodeIntegration: false)
┌───────────────┴──────────────────────────── Renderer (apps/desktop/src/ui) ──────────────────┐
│ - React routes, keyboard-first list UX, virtualized transactions                             │
│ - Calls window.api.v1.* only                                                                  │
└───────────────▲────────────────────────────────────────────────────────────────────────────────┘
                │ DTOs / contracts
┌───────────────┴────────────────────────────────────────────────────────────────────────────────┐
│ shared/  domain/  data/                                                                        │
│ - shared: Result + IPC contracts                                                               │
│ - domain: pure TS logic (money/rules/budget/reconciliation/validation)                        │
│ - data: SQLite schema + repos + migrations + indexes                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Data Model Summary

Core models are in `apps/desktop/src/domain/models.ts`:
- Account
- Category
- Transaction
- BudgetMonth
- Rule

SQLite schema and migration entrypoint:
- Schema definitions: `apps/desktop/src/data/schema.ts`
- SQL migrations: `apps/desktop/src/data/migrations/`
- Startup migration runner: `apps/desktop/src/data/db.ts`

## How to Add a New Feature (exampleFeature)

1. Add domain model/service under `apps/desktop/src/domain/`.
2. Add repository under `apps/desktop/src/data/repositories/`.
3. Register typed IPC in `apps/desktop/electron/ipc/*.ipc.ts` and expose via `preload.ts`.
4. Add UI page under `apps/desktop/src/ui/features/exampleFeature/` and route in `routes/AppRoutes.tsx`.
5. Add tests in `/tests`.

## Performance Notes

- Transactions list uses TanStack Virtual with stable row height for smooth 50k+ rendering.
- Debounced search (`200ms`) limits filter churn and keeps queries responsive.
- Filtering pushes to SQL WHERE clauses with indexes:
  - `(accountId, dateISO DESC)`
  - `(categoryId, dateISO DESC)`
  - `(cleared, dateISO DESC)`
  - `(payee)`
- Budget totals use SQL aggregates to avoid client-side scans.
- WAL mode enabled for SQLite.

## Security Notes

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` in BrowserWindow.
- Renderer never imports Node APIs directly.
- IPC contracts are versioned (`window.api.v1.*`) and boundary-validated with zod.


## Troubleshooting

### Vite `TSConfckParseError` cannot resolve `extends`
If you see a message like:

- `failed to resolve "extends":"../../../tsconfig.json" in apps/desktop/src/ui/tsconfig.json`

make sure the UI tsconfig extends the repo root config using:

```json
"extends": "../../../../tsconfig.json"
```

### Electron on Linux/WSL: `libnss3.so` missing
Electron requires system libraries that may be missing in minimal Linux/WSL environments. Install them and retry:

```bash
sudo apt update
sudo apt install -y libnss3 libatk-bridge2.0-0 libgtk-3-0 libgbm1
```

Then run:

```bash
npm run dev
```
