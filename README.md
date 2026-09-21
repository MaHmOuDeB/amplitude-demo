# Pulse — Analytics Dashboard Demo

A small SaaS-style analytics dashboard built to demonstrate practical **Amplitude Analytics** instrumentation: a deliberate event taxonomy, autocapture, and Session Replay wired into a realistic React app.

![stack](https://img.shields.io/badge/react-18-61dafb) ![stack](https://img.shields.io/badge/typescript-5-3178c6) ![stack](https://img.shields.io/badge/vite-5-646cff) ![stack](https://img.shields.io/badge/amplitude-unified-6366f1)

## What this demonstrates

- **Deliberate event taxonomy** — not just "install the SDK and call it done." Every meaningful user action in the dashboard is instrumented with a purposeful event name and properties (see table below).
- **Autocapture + Session Replay** alongside explicit tracking, so generic interactions are covered without duplicating effort in custom events.
- **A single init point** — `amplitude.initAll()` is called exactly once, at app startup, via [`src/lib/analytics.ts`](src/lib/analytics.ts).
- **Environment-aware config** — the API key is read from `VITE_AMPLITUDE_API_KEY` (Vite's public env prefix) with a loud console warning if it's missing, rather than failing silently.

## Event taxonomy

| Event | Fired when | Key properties |
|---|---|---|
| `Viewed Dashboard` | App loads | `prompt_version` |
| `Applied Filter` | Channel filter changed | `filter_type`, `value` |
| `Changed Date Range` | 7d / 30d / 90d toggle changed | `range` |
| `Viewed Chart Detail` | "Detail" clicked on a chart | `chart` |
| `Exported Report` | "Export CSV" clicked | `format` |
| `Saved View` | A filter combination is saved | `view_name` |
| `Loaded Saved View` | A saved view is selected | `view_name` |

All tracking calls live in [`src/lib/analytics.ts`](src/lib/analytics.ts) — one place to see the entire taxonomy at a glance.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Recharts for charts
- `@amplitude/unified` (Analytics + Session Replay)

## Running it locally

```bash
npm install
cp .env.example .env   # then paste your own Amplitude project API key
npm run dev
```

Open the app, click around (change filters, switch date ranges, save a view, open a chart detail, export a CSV), then check your Amplitude project's **Setup** page or **Live event feed** to see the events land in real time.

## Notes

- The dashboard's data is generated client-side (`src/data/mockData.ts`) — there's no backend, so it runs anywhere `npm run dev` runs.
- `.env` is git-ignored; only `.env.example` is committed.
