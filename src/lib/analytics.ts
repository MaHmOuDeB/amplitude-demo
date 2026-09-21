import * as amplitude from '@amplitude/unified';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

export function initAnalytics(): void {
  if (!AMPLITUDE_API_KEY) {
    console.warn('Amplitude API key missing — analytics disabled');
    return;
  }

  amplitude.initAll(AMPLITUDE_API_KEY, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}

// Fired once, at dashboard load — the setup-verification event.
export function trackViewedDashboard(): void {
  amplitude.track('Viewed Dashboard', { prompt_version: 'BA400.4' });
}

export function trackAppliedFilter(filterType: 'category' | 'date_range', value: string): void {
  amplitude.track('Applied Filter', { filter_type: filterType, value });
}

export function trackChangedDateRange(range: string): void {
  amplitude.track('Changed Date Range', { range });
}

export function trackViewedChartDetail(chart: 'revenue' | 'channel_breakdown'): void {
  amplitude.track('Viewed Chart Detail', { chart });
}

export function trackExportedReport(format: 'csv'): void {
  amplitude.track('Exported Report', { format });
}

export function trackSavedView(viewName: string): void {
  amplitude.track('Saved View', { view_name: viewName });
}

export function trackLoadedSavedView(viewName: string): void {
  amplitude.track('Loaded Saved View', { view_name: viewName });
}
