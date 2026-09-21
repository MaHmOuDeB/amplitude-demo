import type { OrderRow } from '../types';

export function downloadOrdersCsv(orders: OrderRow[]): void {
  const header = ['Order', 'Customer', 'Channel', 'Amount', 'Status', 'Date'];
  const rows = orders.map((o) => [o.id, o.customer, o.channel, o.amount.toFixed(2), o.status, o.date]);
  const csv = [header, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'orders-export.csv';
  link.click();
  URL.revokeObjectURL(url);
}
