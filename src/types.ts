export type Category = 'All Channels' | 'Organic' | 'Paid Search' | 'Referral' | 'Email';

export type DateRange = '7d' | '30d' | '90d';

export interface RevenuePoint {
  date: string;
  revenue: number;
  users: number;
}

export interface ChannelBreakdown {
  channel: string;
  users: number;
}

export interface OrderRow {
  id: string;
  customer: string;
  channel: string;
  amount: number;
  status: 'Paid' | 'Refunded' | 'Pending';
  date: string;
}

export interface SavedView {
  name: string;
  category: Category;
  dateRange: DateRange;
}
