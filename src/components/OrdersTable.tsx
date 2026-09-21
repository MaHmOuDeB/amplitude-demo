import type { OrderRow } from '../types';

const STATUS_STYLES: Record<OrderRow['status'], string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Refunded: 'bg-slate-100 text-slate-600',
};

interface OrdersTableProps {
  orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Recent orders</h2>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-5 py-2.5 font-medium">Order</th>
            <th className="px-5 py-2.5 font-medium">Customer</th>
            <th className="px-5 py-2.5 font-medium">Channel</th>
            <th className="px-5 py-2.5 font-medium">Amount</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td className="px-5 py-3 font-medium text-slate-700">{order.id}</td>
              <td className="px-5 py-3 text-slate-600">{order.customer}</td>
              <td className="px-5 py-3 text-slate-600">{order.channel}</td>
              <td className="px-5 py-3 text-slate-600">${order.amount.toFixed(2)}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-5 py-3 text-slate-500">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
