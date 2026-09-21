# Pulse — Analytics Dashboard Demo

**[Live demo →](https://amplitude-demo-black.vercel.app)**

A small SaaS-style analytics dashboard built to demonstrate practical **Amplitude Analytics** instrumentation: a deliberate event taxonomy, autocapture, and Session Replay wired into a realistic React app.

![stack](https://img.shields.io/badge/react-18-61dafb) ![stack](https://img.shields.io/badge/typescript-5-3178c6) ![stack](https://img.shields.io/badge/vite-5-646cff) ![stack](https://img.shields.io/badge/amplitude-unified-6366f1)

## What this demonstrates

- **Deliberate event taxonomy** — not just "install the SDK and call it done." Every meaningful user action in the dashboard is instrumented with a purposeful event name and properties (see table below).
- **User identification** — `setUserId` + `Identify` (`role`, `plan`, `company_size`, `signup_date`) ties events to a user instead of leaving them anonymous, so they can actually be segmented and cohorted on.
- **Autocapture + Session Replay** alongside explicit tracking, so generic interactions are covered without duplicating effort in custom events.
- **A single init point** — `amplitude.initAll()` is called exactly once, at app startup, via [`src/lib/analytics.ts`](src/lib/analytics.ts).
- **Environment-aware config** — the API key is read from `VITE_AMPLITUDE_API_KEY` (Vite's public env prefix) with a loud console warning if it's missing, rather than failing silently.

## Event taxonomy

Every event is chosen to answer a specific product question, not just to log that a click happened.

| Event | Fired when | Key properties | Answers |
|---|---|---|---|
| `Viewed Dashboard` | App loads | `prompt_version` | Activation — did the user reach the core screen this session? |
| `Applied Filter` | Channel filter changed | `filter_type`, `value` | Which segments do users actually care about slicing by? |
| `Changed Date Range` | 7d / 30d / 90d toggle changed | `range` | Do users default to recent data or trend-watch over longer windows? |
| `Viewed Chart Detail` | "Detail" clicked on a chart | `chart` | Feature engagement — which chart drives deeper investigation? |
| `Exported Report` | "Export CSV" clicked | `format` | Conversion to an outside-the-product action — a strong intent signal. |
| `Saved View` | A filter combination is saved | `view_name` | Retention driver — saving a view predicts the user will come back. |
| `Loaded Saved View` | A saved view is selected | `view_name` | Confirms saved views are actually reused, not just created once. |

All tracking calls live in [`src/lib/analytics.ts`](src/lib/analytics.ts) — one place to see the entire taxonomy at a glance.

### User identity

`identifyDemoUser()` calls `setUserId` and sends an `Identify` with `role`, `plan`, `company_size`, and `signup_date` (`setOnce`, since it shouldn't change after the first identify call). Real deployments would call this right after login with the actual authenticated user's data — here it runs at startup against a fixed demo user, since the app has no auth. Without it, every event in the taxonomy above is anonymous and can't be broken down by "which plan tier saves views the most?" or similar.

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
