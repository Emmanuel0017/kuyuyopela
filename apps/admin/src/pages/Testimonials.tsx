import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, ImageIcon } from 'lucide-react';
import {
  useTestimonialsControllerFindAll, useTestimonialsControllerCreate,
  useTestimonialsControllerUpdate, useTestimonialsControllerRemove,
} from '@kuyuyopela/api-client';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../store/toastStore';

interface TestForm {
  id?: string;
  name: string;
  location: string;
  rating: number;
  note: string;
  existingBefore?: string | null;
  existingAfter?: string | null;
}

const EMPTY: TestForm = { name: '', location: '', rating: 5, note: '' };

// ─── manual multipart upload — generated hooks can't build real FormData for file bodies ───
async function uploadTestimonialImage(testId: string, file: File, kind: 'before' | 'after') {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('accessToken');

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/testimonials/${testId}/${kind}-image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      // no Content-Type header — the browser sets the correct multipart boundary itself
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Upload failed (${res.status})`);
  }
  return res.json();
}

export function TestimonialsPage() {
  const { data: testimonials, isLoading, refetch } = useTestimonialsControllerFindAll();
  const { mutate: createTest } = useTestimonialsControllerCreate();
  const { mutate: updateTest } = useTestimonialsControllerUpdate();
  const { mutate: removeTest } = useTestimonialsControllerRemove();
  const toast = useToast();

  const [modal, setModal] = useState<{ open: boolean; form: TestForm }>({ open: false, form: EMPTY });
  const [del, setDel] = useState<{ open: boolean; id?: string }>({ open: false });
  const [saving, setSaving] = useState(false);

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (beforePreview) URL.revokeObjectURL(beforePreview);
    if (afterPreview) URL.revokeObjectURL(afterPreview);
  }, [beforePreview, afterPreview]);

  function openCreate() {
    setBeforeFile(null); setAfterFile(null);
    setBeforePreview(null); setAfterPreview(null);
    setModal({ open: true, form: EMPTY });
  }
  function openEdit(t: any) {
    setBeforeFile(null); setAfterFile(null);
    setBeforePreview(null); setAfterPreview(null);
    setModal({
      open: true,
      form: {
        id: t.id, name: t.name, location: t.location, rating: t.rating, note: t.note ?? '',
        existingBefore: t.beforeImage, existingAfter: t.afterImage,
      },
    });
  }
  function close() {
    setModal({ open: false, form: EMPTY });
    setBeforeFile(null); setAfterFile(null);
    setBeforePreview(null); setAfterPreview(null);
  }

  function handleFile(setter: (f: File | null) => void, setPreview: (u: string | null) => void, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please select an image', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5 MB', 'error'); return; }
    setter(file);
    setPreview(URL.createObjectURL(file));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { existingBefore, existingAfter, ...payload } = modal.form;
    const data = payload as any;
    delete data.id;

    setSaving(true);
    try {
      const testId = modal.form.id
        ? await new Promise<string>((resolve, reject) =>
            updateTest({ id: modal.form.id!, data }, { onSuccess: () => resolve(modal.form.id!), onError: reject }),
          )
        : await new Promise<string>((resolve, reject) =>
            createTest({ data }, { onSuccess: (created: any) => resolve(created.id), onError: reject }),
          );

      if (beforeFile) await uploadTestimonialImage(testId, beforeFile, 'before');
      if (afterFile) await uploadTestimonialImage(testId, afterFile, 'after');

      toast(modal.form.id ? 'Testimonial updated' : 'Testimonial added');
      close();
      refetch();
    } catch (err: any) {
      toast(err.message ?? 'Something went wrong saving the testimonial', 'error');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!del.id) return;
    removeTest({ id: del.id }, { onSuccess: () => { toast('Testimonial removed'); setDel({ open: false }); refetch(); } });
  }

  if (isLoading) return <p>Loading testimonials…</p>;

  const beforeSrc = beforePreview ?? modal.form.existingBefore ?? null;
  const afterSrc = afterPreview ?? modal.form.existingAfter ?? null;

  return (
    <div>
      <div className="table-header">
        <div>
          <div className="page-title">Testimonials / Results</div>
          <div className="page-sub">Manage before/after customer results</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Testimonial</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr><th>Before/After</th><th>Name</th><th>Location</th><th>Rating</th><th>Note</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {testimonials?.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-500 py-8">No testimonials yet.</td></tr>
              )}
              {testimonials?.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="flex gap-1">
                      {t.beforeImage
                        ? <img src={t.beforeImage} alt="before" className="w-10 h-10 object-cover rounded" />
                        : <div className="w-10 h-10 bg-tide/10 rounded flex items-center justify-center text-tide"><ImageIcon size={14} /></div>}
                      {t.afterImage
                        ? <img src={t.afterImage} alt="after" className="w-10 h-10 object-cover rounded" />
                        : <div className="w-10 h-10 bg-tide/10 rounded flex items-center justify-center text-tide"><ImageIcon size={14} /></div>}
                    </div>
                  </td>
                  <td className="font-medium">{t.name}</td>
                  <td>{t.location}</td>
                  <td className="text-[#FFC107]">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</td>
                  <td className="max-w-[200px] truncate">{t.note ?? '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)} title="Edit"><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDel({ open: true, id: t.id })} title="Remove"><Trash2 size={14} className="text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.open} onClose={close} title={modal.form.id ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={save}>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group"><label>Customer Name</label>
              <input required value={modal.form.name} onChange={(e) => setModal({ ...modal, form: { ...modal.form, name: e.target.value } })} />
            </div>
            <div className="form-group"><label>Location</label>
              <input required value={modal.form.location} onChange={(e) => setModal({ ...modal, form: { ...modal.form, location: e.target.value } })} />
            </div>
          </div>
          <div className="form-group"><label>Rating (1–5)</label>
            <input type="number" min={1} max={5} value={modal.form.rating} onChange={(e) => setModal({ ...modal, form: { ...modal.form, rating: Number(e.target.value) } })} />
          </div>
          <div className="form-group"><label>Note</label>
            <input value={modal.form.note} onChange={(e) => setModal({ ...modal, form: { ...modal.form, note: e.target.value } })} placeholder="After 2 bottles" />
          </div>

          <ImageUpload
            label="Before Image"
            previewSrc={beforeSrc}
            inputRef={beforeInputRef}
            onChange={(e) => handleFile(setBeforeFile, setBeforePreview, e)}
            onClear={() => { setBeforeFile(null); setBeforePreview(null); if (beforeInputRef.current) beforeInputRef.current.value = ''; }}
            inputId="beforeImageInput"
          />

          <ImageUpload
            label="After Image"
            previewSrc={afterSrc}
            inputRef={afterInputRef}
            onChange={(e) => handleFile(setAfterFile, setAfterPreview, e)}
            onClear={() => { setAfterFile(null); setAfterPreview(null); if (afterInputRef.current) afterInputRef.current.value = ''; }}
            inputId="afterImageInput"
          />

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : modal.form.id ? 'Save Changes' : 'Add Testimonial'}
            </button>
            <button type="button" className="btn btn-outline" onClick={close} disabled={saving}>Cancel</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={del.open}
        onClose={() => setDel({ open: false })}
        onConfirm={confirmDelete}
        title="Remove testimonial?"
        message="This testimonial will be removed from the public site."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}

function ImageUpload({
  label, previewSrc, inputRef, inputId, onChange, onClear,
}: {
  label: string;
  previewSrc: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const hasFile = previewSrc != null;
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 shrink-0">
          {hasFile ? (
            <img src={previewSrc!} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <Upload size={20} className="text-neutral-400" />
          )}
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" id={inputId} />
          <label htmlFor={inputId} className="btn btn-outline btn-sm cursor-pointer">
            <Upload size={14} /> Choose image
          </label>
          {hasFile && (
            <button type="button" onClick={onClear} className="btn btn-ghost btn-sm ml-2">
              <X size={14} /> Clear
            </button>
          )}
          <div className="text-xs text-neutral-500 mt-1">PNG, JPG up to 5 MB</div>
        </div>
      </div>
    </div>
  );
}