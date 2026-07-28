import { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import {
  useAgentsControllerFindAll, useAgentsControllerSetStatus, useAgentsControllerRemove,
} from '@kuyuyopela/api-client';
import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../store/toastStore';

const NEXT_STATUS: Record<string, string[]> = {
  PENDING:  ['APPROVED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
};

export function AgentsPage() {
   const { data: agents, isLoading, refetch } = useAgentsControllerFindAll({} as any);  
  const { mutate: setStatus } = useAgentsControllerSetStatus();
  const { mutate: removeAgent } = useAgentsControllerRemove();
  const toast = useToast();
  const [del, setDel] = useState<{ open: boolean; id?: string }>({ open: false });

  if (isLoading) return <p>Loading agents…</p>;

  return (
    <div>
      <div className="page-title">Agent Applications</div>
      <div className="page-sub">Review and approve agent applications</div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr><th>Name</th><th>City</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {agents?.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.name}</td>
                  <td>{a.city}</td>
                  <td>{a.phone}</td>
                  <td><Badge status={a.status} /></td>
                  <td>
                    <div className="flex items-center gap-1">
                      {NEXT_STATUS[a.status]?.includes('APPROVED') && (
                        <button
                          className="btn btn-ghost btn-sm text-tide"
                          onClick={() => setStatus(
                            { id: a.id, data: { status: 'APPROVED' } },
                            { onSuccess: () => { toast('Agent approved'); refetch(); } },
                          )}
                          title="Approve"
                        >
                          <Check size={14} /> <span className="text-xs">Approve</span>
                        </button>
                      )}
                      {NEXT_STATUS[a.status]?.includes('REJECTED') && (
                        <button
                          className="btn btn-ghost btn-sm text-red-600"
                          onClick={() => setStatus(
                            { id: a.id, data: { status: 'REJECTED' } },
                            { onSuccess: () => { toast('Agent rejected'); refetch(); } },
                          )}
                          title="Reject"
                        >
                          <X size={14} /> <span className="text-xs">Reject</span>
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setDel({ open: true, id: a.id })}
                        title="Remove"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={del.open}
        onClose={() => setDel({ open: false })}
        onConfirm={() => del.id && removeAgent({ id: del.id }, {
          onSuccess: () => { toast('Agent removed'); setDel({ open: false }); refetch(); },
        })}
        title="Remove agent?"
        message="This will permanently remove the agent record."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}