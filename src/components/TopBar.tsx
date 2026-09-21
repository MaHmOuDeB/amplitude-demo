import { Download } from 'lucide-react';

interface TopBarProps {
  onExport: () => void;
}

export function TopBar({ onExport }: TopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">Revenue, users, and orders across every channel.</p>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
      >
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );
}
