import { useCustomersControllerFindAll } from '@kuyuyopela/api-client';
import { Users } from 'lucide-react';

const fmt = (n: number) => `MK ${n.toLocaleString()}`;

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomersControllerFindAll();
  if (isLoading) return <p>Loading customers…</p>;

  return (
    <div>
      <div className="page-title">Customers</div>
      <div className="page-sub">Your customer base</div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {c.name?.slice(0, 1).toUpperCase() ?? <Users size={12} />}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone ?? '—'}</td>
                  <td>{c.orderCount ?? 0}</td>
                  <td>{fmt(c.totalSpent ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}