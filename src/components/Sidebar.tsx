import { Activity, BarChart3, Users, Settings, Radio } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: BarChart3, active: true },
  { label: 'Customers', icon: Users, active: false },
  { label: 'Live', icon: Radio, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 sm:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Activity size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight">Pulse</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-brand-50 text-brand-700'
                : 'cursor-not-allowed text-slate-400'
            }`}
            title={active ? undefined : 'Not wired up in this demo'}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <p className="px-2 text-xs leading-relaxed text-slate-400">
        Demo dashboard instrumented with Amplitude Analytics + Session Replay.
      </p>
    </aside>
  );
}
