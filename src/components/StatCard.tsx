import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export function StatCard({ label, value, delta, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      <div className={`mt-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {delta} vs. previous period
      </div>
    </div>
  );
}
