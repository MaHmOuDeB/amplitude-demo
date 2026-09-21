import type { Category, ChannelBreakdown, DateRange, OrderRow, RevenuePoint } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rangeToDays: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

const categoryMultiplier: Record<Category, number> = {
  'All Channels': 1,
  Organic: 0.42,
  'Paid Search': 0.3,
  Referral: 0.16,
  Email: 0.12,
};

export function getRevenueSeries(range: DateRange, category: Category): RevenuePoint[] {
  const days = rangeToDays[range];
  const rand = seededRandom(days * 17 + category.length);
  const points: RevenuePoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today.getTime() - i * DAY_MS);
    const base = 4200 + Math.sin(i / 4) * 900 + rand() * 700;
    const revenue = Math.round(base * categoryMultiplier[category]);
    const users = Math.round((180 + Math.cos(i / 5) * 40 + rand() * 60) * categoryMultiplier[category]);
    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue,
      users,
    });
  }

  return points;
}

export function getChannelBreakdown(range: DateRange): ChannelBreakdown[] {
  const scale = rangeToDays[range] / 30;
  return [
    { channel: 'Organic', users: Math.round(2140 * scale) },
    { channel: 'Paid Search', users: Math.round(1530 * scale) },
    { channel: 'Referral', users: Math.round(820 * scale) },
    { channel: 'Email', users: Math.round(610 * scale) },
  ];
}

const customers = ['Amara Chen', 'Lukas Weber', 'Priya Nair', 'Jonas Fischer', 'Elena Rossi', 'Mateo Silva', 'Sofia Bauer', 'Noah Kim'];
const channels = ['Organic', 'Paid Search', 'Referral', 'Email'];
const statuses: OrderRow['status'][] = ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded'];

export function getRecentOrders(range: DateRange, category: Category): OrderRow[] {
  const rand = seededRandom(rangeToDays[range] * 7 + category.length * 3);
  const count = 8;
  const today = new Date();

  return Array.from({ length: count }, (_, i) => {
    const channel = category === 'All Channels' ? channels[Math.floor(rand() * channels.length)] : category;
    const daysAgo = Math.floor(rand() * rangeToDays[range]);
    const date = new Date(today.getTime() - daysAgo * DAY_MS);
    return {
      id: `ORD-${1000 + i}`,
      customer: customers[Math.floor(rand() * customers.length)],
      channel,
      amount: Math.round((40 + rand() * 260) * 100) / 100,
      status: statuses[Math.floor(rand() * statuses.length)],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });
}
