import { useNavigate } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Clock, Package,
  ShoppingCart, UserPlus, CreditCard, MessageSquareQuote,
} from 'lucide-react';
import {
  useDashboardControllerStats,
  useDashboardControllerWeeklySales,
  useDashboardControllerActivity,
} from '@kuyuyopela/api-client';
import { StatCard } from '../components/StatCard';
import { BarChart } from '../components/BarChart';
import { Badge } from '../components/Badge';

const ICON_MAP: Record<string, typeof ShoppingCart> = {
  order: ShoppingCart,
  agent: UserPlus,
  payment: CreditCard,
  product: Package,
  testimonial: MessageSquareQuote,
};

const fmt = (n: number) => `MK ${n.toLocaleString()}`;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardControllerStats();
  const { data: weeklySales = [] } = useDashboardControllerWeeklySales();
  const { data: activity = [] } = useDashboardControllerActivity();

  if (statsLoading) return <p>Loading dashboard…</p>;

  return (
    <div>
      <div className="page-title">Dashboard Overview</div>
      <div className="page-sub">Welcome back — here's what's happening today.</div>

      <div className="stat-grid">
        <StatCard
          label="Total Revenue"
          value={fmt(stats?.revenue ?? 0)}
          delta="All-time"
          trend="up"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          delta="All-time"
          trend="up"
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          delta="Awaiting action"
          trend={stats?.pendingOrders > 0 ? 'down' : 'up'}
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Active Products"
          value={stats?.activeProducts ?? 0}
          delta={`${stats?.totalCustomers ?? 0} customers total`}
          trend="up"
          icon={<Package size={18} />}
        />
      </div>

      <div className="two-col">
        <div className="card">
          <h3 className="font-semibold mb-4">Weekly Sales (MK '000)</h3>
          {weeklySales.length > 0 ? (
            <BarChart data={weeklySales} />
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center">No sales data yet</p>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-[13px]">
            {activity.length === 0 && (
              <p className="text-sm text-gray-500">No activity yet</p>
            )}
            {activity.map((a: any, i: number) => {
              const Icon = ICON_MAP[a.kind] ?? ShoppingCart;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="icon-wrap shrink-0" style={{ width: 28, height: 28 }}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>{a.text}</div>
                    <div className="text-xs text-gray-500">{a.timeAgo}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-header">
          <h3 className="font-semibold">Recent Orders</h3>
          <span className="text-xs text-tide cursor-pointer hover:underline" onClick={() => navigate('/orders')}>
            View All →
          </span>
        </div>
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6">No orders yet</td>
                </tr>
              )}
              {stats?.recentOrders?.map((o: any) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td>{o.customer.name}</td>
                  <td>{fmt(o.total)}</td>
                  <td><Badge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}