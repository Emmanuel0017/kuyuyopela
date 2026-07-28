import { useState } from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import {
  useOrdersControllerFindAll,
  useOrdersControllerUpdateStatus,
} from '@kuyuyopela/api-client';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useToast } from '../store/toastStore';

const NEXT_STATUS: Record<string, string[]> = {
  PENDING:    ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED'],
  DELIVERED:  [],
  CANCELLED:  [],
};

const fmt = (n: number) => `MK ${n.toLocaleString()}`;

export function OrdersPage() {
  const { data: orders, isLoading, refetch } = useOrdersControllerFindAll();
  const { mutate: updateStatus } = useOrdersControllerUpdateStatus();
  const toast = useToast();
  const [view, setView] = useState<any | null>(null);

  if (isLoading) return <p>Loading orders…</p>;

  return (
    <div>
      <div className="page-title">Orders</div>
      <div className="page-sub">Track and update customer orders</div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((o) => {
                const nextOptions = NEXT_STATUS[o.status] ?? [];
                return (
                  <tr key={o.id}>
                    <td className="font-mono text-xs">#{o.id.slice(0, 8)}</td>
                    <td>{o.customer.name}</td>
                    <td>{new Date(o.createdAt ?? Date.now()).toLocaleDateString()}</td>
                    <td>{fmt(o.total)}</td>
                    <td><Badge status={o.status} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="btn btn-ghost btn-sm" onClick={() => setView(o)} title="View">
                          <Eye size={14} />
                        </button>
                        {nextOptions.slice(0, 1).map((next) => (
                          <button
                            key={next}
                            className="btn btn-ghost btn-sm text-tide"
                            onClick={() => updateStatus(
                              { id: o.id, data: { status: next as any } },
                              { onSuccess: () => { toast(`Marked ${next}`); refetch(); } },
                            )}
                            title={`Mark as ${next}`}
                          >
                            <ChevronRight size={14} />
                            <span className="text-xs">{next}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title="Order Details" className="w-140">
        {view && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono">#{view.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span>{view.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span>{view.customer.phone ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{view.customer.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge status={view.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">{fmt(view.total)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-3 mt-3">
              <div className="text-gray-500 mb-2">Items</div>
              {view.items?.map((it: any, i: number) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>{it.name ?? it.productId} × {it.quantity}</span>
                  <span>{fmt((it.price ?? 0) * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}