import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  useStoresControllerFindAll, useStoresControllerCreate,
  useStoresControllerUpdate, useStoresControllerRemove,
} from '@kuyuyopela/api-client';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../store/toastStore';

interface StoreForm { id?: string; city: string; address: string; phone: string; }
const EMPTY: StoreForm = { city: '', address: '', phone: '' };

export function StoresPage() {
  const { data: stores, isLoading, refetch } = useStoresControllerFindAll();
  const { mutate: createStore } = useStoresControllerCreate();
  const { mutate: updateStore } = useStoresControllerUpdate();
  const { mutate: removeStore } = useStoresControllerRemove();
  const toast = useToast();

  const [modal, setModal] = useState<{ open: boolean; form: StoreForm }>({ open: false, form: EMPTY });
  const [del, setDel] = useState<{ open: boolean; id?: string }>({ open: false });

  function openCreate() { setModal({ open: true, form: EMPTY }); }
  function openEdit(s: any) {
    setModal({ open: true, form: { id: s.id, city: s.city, address: s.address, phone: s.phone } });
  }
  function close() { setModal({ open: false, form: EMPTY }); }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...modal.form } as any;
    delete data.id;
    if (modal.form.id) {
      updateStore(
        { id: modal.form.id, data },
        { onSuccess: () => { toast('Location updated'); close(); refetch(); } },
      );
    } else {
      createStore(
        { data },
        { onSuccess: () => { toast('Location added'); close(); refetch(); } },
      );
    }
  }

  if (isLoading) return <p>Loading stores…</p>;

  return (
    <div>
      <div className="table-header">
        <div>
          <div className="page-title">Store Locations</div>
          <div className="page-sub">Manage agent/stockist locations</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr><th>City</th><th>Address</th><th>Phone</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {stores?.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.city}</td>
                  <td>{s.address}</td>
                  <td>{s.phone}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDel({ open: true, id: s.id })} title="Remove">
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

      <Modal open={modal.open} onClose={close} title={modal.form.id ? 'Edit Location' : 'Add Location'}>
        <form onSubmit={save}>
          <div className="form-group"><label>City</label>
            <input required value={modal.form.city} onChange={(e) => setModal({ ...modal, form: { ...modal.form, city: e.target.value } })} />
          </div>
          <div className="form-group"><label>Address</label>
            <input required value={modal.form.address} onChange={(e) => setModal({ ...modal, form: { ...modal.form, address: e.target.value } })} />
          </div>
          <div className="form-group"><label>Phone</label>
            <input required value={modal.form.phone} onChange={(e) => setModal({ ...modal, form: { ...modal.form, phone: e.target.value } })} />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {modal.form.id ? 'Save Changes' : 'Add Location'}
            </button>
            <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={del.open}
        onClose={() => setDel({ open: false })}
        onConfirm={() => del.id && removeStore({ id: del.id }, {
          onSuccess: () => { toast('Location removed'); setDel({ open: false }); refetch(); },
        })}
        title="Remove location?"
        message="This will remove the location from the store locator."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}