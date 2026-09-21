import { useMemo, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatCard } from './components/StatCard';
import { FilterBar } from './components/FilterBar';
import { RevenueChart } from './components/RevenueChart';
import { ChannelChart } from './components/ChannelChart';
import { OrdersTable } from './components/OrdersTable';
import { ChartDetailModal } from './components/ChartDetailModal';
import { getChannelBreakdown, getRecentOrders, getRevenueSeries } from './data/mockData';
import { downloadOrdersCsv } from './lib/exportCsv';
import {
  trackAppliedFilter,
  trackChangedDateRange,
  trackExportedReport,
  trackLoadedSavedView,
  trackSavedView,
  trackViewedChartDetail,
} from './lib/analytics';
import type { Category, DateRange, SavedView } from './types';

export default function App() {
  const [category, setCategory] = useState<Category>('All Channels');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [detailChart, setDetailChart] = useState<'revenue' | 'channel_breakdown' | null>(null);

  const revenueSeries = useMemo(() => getRevenueSeries(dateRange, category), [dateRange, category]);
  const channelBreakdown = useMemo(() => getChannelBreakdown(dateRange), [dateRange]);
  const orders = useMemo(() => getRecentOrders(dateRange, category), [dateRange, category]);

  const totalRevenue = revenueSeries.reduce((sum, p) => sum + p.revenue, 0);
  const totalUsers = revenueSeries.reduce((sum, p) => sum + p.users, 0);
  const avgOrderValue = orders.length ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length : 0;
  const conversionRate = totalUsers ? (orders.length / totalUsers) * 100 : 0;

  function handleCategoryChange(next: Category) {
    setCategory(next);
    trackAppliedFilter('category', next);
  }

  function handleDateRangeChange(next: DateRange) {
    setDateRange(next);
    trackChangedDateRange(next);
  }

  function handleSaveView(name: string) {
    const view: SavedView = { name, category, dateRange };
    setSavedViews((prev) => [...prev.filter((v) => v.name !== name), view]);
    trackSavedView(name);
  }

  function handleLoadView(view: SavedView) {
    setCategory(view.category);
    setDateRange(view.dateRange);
    trackLoadedSavedView(view.name);
  }

  function handleExport() {
    downloadOrdersCsv(orders);
    trackExportedReport('csv');
  }

  function handleViewDetail(chart: 'revenue' | 'channel_breakdown') {
    setDetailChart(chart);
    trackViewedChartDetail(chart);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <TopBar onExport={handleExport} />

        <FilterBar
          category={category}
          dateRange={dateRange}
          savedViews={savedViews}
          onCategoryChange={handleCategoryChange}
          onDateRangeChange={handleDateRangeChange}
          onSaveView={handleSaveView}
          onLoadView={handleLoadView}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString()}`} delta="12.4%" trend="up" icon={DollarSign} />
          <StatCard label="Active users" value={totalUsers.toLocaleString()} delta="6.1%" trend="up" icon={Users} />
          <StatCard label="Conversion rate" value={`${conversionRate.toFixed(2)}%`} delta="0.8%" trend="down" icon={TrendingUp} />
          <StatCard label="Avg. order value" value={`$${avgOrderValue.toFixed(2)}`} delta="3.2%" trend="up" icon={ShoppingCart} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RevenueChart data={revenueSeries} onViewDetail={() => handleViewDetail('revenue')} />
          <ChannelChart data={channelBreakdown} onViewDetail={() => handleViewDetail('channel_breakdown')} />
        </div>

        <OrdersTable orders={orders} />
      </main>

      {detailChart && (
        <ChartDetailModal
          title={detailChart === 'revenue' ? 'Revenue trend — detail' : 'Users by channel — detail'}
          onClose={() => setDetailChart(null)}
        >
          <p className="text-sm text-slate-600">
            {detailChart === 'revenue'
              ? `Revenue peaked at $${Math.max(...revenueSeries.map((p) => p.revenue)).toLocaleString()} over the selected ${dateRange} window, tracking ${category.toLowerCase()}.`
              : `${channelBreakdown[0]?.channel} is the top channel with ${channelBreakdown[0]?.users.toLocaleString()} users over the last ${dateRange}.`}
          </p>
        </ChartDetailModal>
      )}
    </div>
  );
}
