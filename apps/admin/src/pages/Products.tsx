import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import {
  useProductsControllerFindAll, useProductsControllerCreate,
  useProductsControllerUpdate, useProductsControllerRemove,
  useProductsControllerUploadImage,
} from '@kuyuyopela/api-client';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../store/toastStore';

interface ProductForm {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  existingImageUrl?: string | null;
}

const EMPTY: ProductForm = {
  name: '', category: 'Bathing Soap', price: 0, stock: 0, description: '',
};

const fmt = (n: number) => `MK ${n.toLocaleString()}`;

export function ProductsPage() {
  const { data: products, isLoading, refetch } = useProductsControllerFindAll();
  const { mutate: createProduct, isPending: creating } = useProductsControllerCreate();
  const { mutate: updateProduct, isPending: updating } = useProductsControllerUpdate();
  const { mutate: removeProduct } = useProductsControllerRemove();
  const { mutate: uploadImage } = useProductsControllerUploadImage();
  const toast = useToast();

  const [modal, setModal] = useState<{ open: boolean; form: ProductForm }>({ open: false, form: EMPTY });
  const [del, setDel] = useState<{ open: boolean; id?: string }>({ open: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function openCreate() {
    setImageFile(null); setPreviewUrl(null);
    setModal({ open: true, form: EMPTY });
  }
  function openEdit(p: any) {
    setImageFile(null); setPreviewUrl(null);
    setModal({
      open: true,
      form: {
        id: p.id, name: p.name, category: p.category ?? 'Bathing Soap',
        price: p.price, stock: p.stock ?? 0, description: p.description ?? '',
        existingImageUrl: p.imageUrl,
      },
    });
  }
  function close() {
    setModal({ open: false, form: EMPTY });
    setImageFile(null); setPreviewUrl(null);
  }
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please select an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5 MB', 'error'); return; }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
  function clearImage() {
    setImageFile(null); setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const { existingImageUrl, ...payload } = modal.form;
    const data = payload as any;
    delete data.id;

    const onTextDone = (productId: string) => {
      if (imageFile) {
        // TODO: proper upload type — generated hook signature is wrong for file body
        (uploadImage as any)(
          { id: productId, data: { file: imageFile } },
          {
            onSuccess: () => { toast('Product saved with image'); close(); refetch(); },
            onError: () => { toast('Saved but image upload failed', 'error'); close(); refetch(); },
          },
        );
      } else {
        toast(modal.form.id ? 'Product updated' : 'Product created');
        close(); refetch();
      }
    };

    if (modal.form.id) {
      updateProduct({ id: modal.form.id, data }, { onSuccess: () => onTextDone(modal.form.id!) });
    } else {
      createProduct({ data }, { onSuccess: (created: any) => onTextDone(created.id) });
    }
  }

  function confirmDelete() {
    if (!del.id) return;
    removeProduct({ id: del.id }, { onSuccess: () => { toast('Product removed'); setDel({ open: false }); refetch(); } });
  }

  if (isLoading) return <p>Loading products…</p>;
  const previewSrc = previewUrl ?? modal.form.existingImageUrl ?? null;

  return (
    <div>
      <div className="table-header">
        <div>
          <div className="page-title">Products</div>
          <div className="page-sub">Manage your product catalog</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table-mini">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-500 py-8">No products yet — click "Add Product" to get started.</td></tr>
              )}
              {products?.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-tide/10 rounded flex items-center justify-center text-tide">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.category ?? '—'}</td>
                  <td>{fmt(p.price)}</td>
                  <td>
                    <span className={p.stock === 0 ? 'text-red-600 font-semibold' : ''}>{p.stock}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit"><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDel({ open: true, id: p.id })} title="Delete"><Trash2 size={14} className="text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.open} onClose={close} title={modal.form.id ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={save}>
          <div className="form-group"><label>Product Name</label>
            <input required value={modal.form.name} onChange={(e) => setModal({ ...modal, form: { ...modal.form, name: e.target.value } })} />
          </div>
          <div className="form-group"><label>Category</label>
            <select value={modal.form.category} onChange={(e) => setModal({ ...modal, form: { ...modal.form, category: e.target.value } })}>
              <option>Bathing Soap</option><option>Face Care</option>
              <option>Body Care</option><option>Gift Sets</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group"><label>Price (MK)</label>
              <input required type="number" value={modal.form.price} onChange={(e) => setModal({ ...modal, form: { ...modal.form, price: Number(e.target.value) } })} />
            </div>
            <div className="form-group"><label>Stock</label>
              <input required type="number" value={modal.form.stock} onChange={(e) => setModal({ ...modal, form: { ...modal.form, stock: Number(e.target.value) } })} />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 shrink-0">
                {previewSrc ? (
                  <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={20} className="text-neutral-400" />
                )}
              </div>
              <div className="flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="productImageInput" />
                <label htmlFor="productImageInput" className="btn btn-outline btn-sm cursor-pointer">
                  <Upload size={14} /> {imageFile ? 'Change' : 'Choose image'}
                </label>
                {imageFile && (
                  <button type="button" onClick={clearImage} className="btn btn-ghost btn-sm ml-2">
                    <X size={14} /> Clear
                  </button>
                )}
                <div className="text-xs text-neutral-500 mt-1">
                  {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)` : 'PNG, JPG up to 5 MB'}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group"><label>Description</label>
            <textarea rows={3} value={modal.form.description} onChange={(e) => setModal({ ...modal, form: { ...modal.form, description: e.target.value } })} />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={creating || updating} className="btn btn-primary">
              {modal.form.id ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={del.open}
        onClose={() => setDel({ open: false })}
        onConfirm={confirmDelete}
        title="Delete product?"
        message="This product will be hidden from the storefront but its order history is preserved."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}