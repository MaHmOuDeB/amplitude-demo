import * as amplitude from '@amplitude/unified';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

// Stand-in for a real logged-in user, since this demo has no auth/backend.
const DEMO_USER = {
  userId: 'demo-user-1024',
  role: 'Growth Analyst',
  plan: 'Team',
  companySize: '51-200',
  signupDate: '2026-01-14',
};

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

// Ties events to a user and sets the properties Amplitude segments/cohorts on
// (plan, role, company size) — without this, events are anonymous and can't
// answer questions like "which plan tier uses saved views the most?"
export function identifyDemoUser(): void {
  amplitude.setUserId(DEMO_USER.userId);

  const identifyEvent = new amplitude.Identify()
    .set('role', DEMO_USER.role)
    .set('plan', DEMO_USER.plan)
    .set('company_size', DEMO_USER.companySize)
    .setOnce('signup_date', DEMO_USER.signupDate);

  amplitude.identify(identifyEvent);
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
