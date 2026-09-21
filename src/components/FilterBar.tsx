import { useState } from 'react';
import { Bookmark, Plus } from 'lucide-react';
import type { Category, DateRange, SavedView } from '../types';

const CATEGORIES: Category[] = ['All Channels', 'Organic', 'Paid Search', 'Referral', 'Email'];
const RANGES: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

interface FilterBarProps {
  category: Category;
  dateRange: DateRange;
  savedViews: SavedView[];
  onCategoryChange: (category: Category) => void;
  onDateRangeChange: (range: DateRange) => void;
  onSaveView: (name: string) => void;
  onLoadView: (view: SavedView) => void;
}

export function FilterBar({
  category,
  dateRange,
  savedViews,
  onCategoryChange,
  onDateRangeChange,
  onSaveView,
  onLoadView,
}: FilterBarProps) {
  const [isNaming, setIsNaming] = useState(false);
  const [name, setName] = useState('');

  function submitSaveView() {
    const trimmed = name.trim();
    if (trimmed) {
      onSaveView(trimmed);
      setName('');
    }
    setIsNaming(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as Category)}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex overflow-hidden rounded-lg border border-slate-200">
        {RANGES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onDateRangeChange(value)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              dateRange === value ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-slate-200" />

      {savedViews.length > 0 && (
        <select
          defaultValue=""
          onChange={(e) => {
            const view = savedViews.find((v) => v.name === e.target.value);
            if (view) onLoadView(view);
            e.target.value = '';
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="" disabled>
            Saved views ({savedViews.length})
          </option>
          {savedViews.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>
      )}

      {isNaming ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSaveView()}
            placeholder="View name"
            className="w-36 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={submitSaveView}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsNaming(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
        >
          <Plus size={15} />
          <Bookmark size={15} />
          Save view
        </button>
      )}
    </div>
  );
}
