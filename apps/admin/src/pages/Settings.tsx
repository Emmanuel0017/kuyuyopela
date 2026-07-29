import { useEffect, useState, useRef } from 'react';
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import {
  useSettingsControllerGet, useSettingsControllerUpdate,
} from '@kuyuyopela/api-client';
import { useToast } from '../store/toastStore';

interface Form {
  siteName: string; supportPhone: string; supportEmail: string; whatsappNumber: string;
}

// ─── manual multipart upload — generated hooks can't build real FormData for file bodies ───
async function uploadAboutImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('accessToken');

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/settings/about-image`,
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

export function SettingsPage() {
  const { data: settings, isLoading } = useSettingsControllerGet();
  const { mutate: updateSettings, isPending } = useSettingsControllerUpdate();
  const toast = useToast();

  const [form, setForm] = useState<Form>({
    siteName: '', supportPhone: '', supportEmail: '', whatsappNumber: '',
  });
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const [aboutFile, setAboutFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (aboutPreview) URL.revokeObjectURL(aboutPreview); }, [aboutPreview]);

  useEffect(() => {
    if (settings) setForm({
      siteName: settings.siteName,
      supportPhone: settings.supportPhone,
      supportEmail: settings.supportEmail,
      whatsappNumber: settings.whatsappNumber,
    });
  }, [settings]);

  if (isLoading) return <p>Loading settings…</p>;

  const existingAbout = settings?.aboutImageUrl ?? null;
  const aboutSrc = aboutPreview ?? existingAbout;

  function handleAboutFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please select an image', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5 MB', 'error'); return; }
    setAboutFile(file);
    setAboutPreview(URL.createObjectURL(file));
  }
  function clearAbout() {
    setAboutFile(null); setAboutPreview(null);
    if (aboutInputRef.current) aboutInputRef.current.value = '';
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateSettings(
      { data: form },
      {
        onSuccess: async () => {
          if (aboutFile) {
            setUploading(true);
            try {
              await uploadAboutImage(aboutFile);
              toast('Settings + about image saved');
              clearAbout();
            } catch (err: any) {
              toast(err.message ?? 'Settings saved, but image upload failed', 'error');
            } finally {
              setUploading(false);
            }
          } else {
            toast('Settings saved');
          }
        },
      },
    );
  }

  return (
    <div>
      <div className="page-title">Settings</div>
      <div className="page-sub">Site &amp; brand configuration</div>

      <div className="two-col">
        <form onSubmit={save} className="card">
          <h3 className="font-semibold mb-4">Site Information</h3>
          {(['siteName', 'supportPhone', 'supportEmail', 'whatsappNumber'] as const).map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                type={field.includes('Email') ? 'email' : 'text'}
              />
            </div>
          ))}

          <div className="form-group">
            <label>About / Manufacturing Image</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 shrink-0">
                {aboutSrc ? (
                  <img src={aboutSrc} alt="about" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={22} className="text-neutral-400" />
                )}
              </div>
              <div className="flex-1">
                <input ref={aboutInputRef} type="file" accept="image/*" onChange={handleAboutFile} className="hidden" id="aboutImageInput" />
                <label htmlFor="aboutImageInput" className="btn btn-outline btn-sm cursor-pointer">
                  <Upload size={14} /> {aboutFile ? 'Change' : 'Choose image'}
                </label>
                {aboutFile && (
                  <button type="button" onClick={clearAbout} className="btn btn-ghost btn-sm ml-2">
                    <X size={14} /> Clear
                  </button>
                )}
                <div className="text-xs text-neutral-500 mt-1">
                  {aboutFile ? `${aboutFile.name} (${(aboutFile.size / 1024).toFixed(0)} KB) — uploads with "Save Changes"` : 'Shown on the storefront About section. PNG, JPG up to 5 MB.'}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isPending || uploading} className="btn btn-primary">
            <Save size={16} /> {isPending || uploading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <div className="card">
          <h3 className="font-semibold mb-4">Brand Colors</h3>
          <div className="color-row"><span className="swatch" style={{ background: '#0B3D24' }} /> Dark Green — <code className="text-xs">#0B3D24</code></div>
          <div className="color-row"><span className="swatch" style={{ background: '#0F5132' }} /> Green — <code className="text-xs">#0F5132</code></div>
          <div className="color-row"><span className="swatch" style={{ background: '#198754' }} /> Light Green — <code className="text-xs">#198754</code></div>
          <div className="color-row"><span className="swatch" style={{ background: '#FFC107' }} /> Gold — <code className="text-xs">#FFC107</code></div>
          <div className="color-row"><span className="swatch" style={{ background: '#1a1a1a' }} /> Black — <code className="text-xs">#1a1a1a</code></div>
          <div className="color-row"><span className="swatch" style={{ background: '#F5F7F6', border: '1px solid #ccc' }} /> Off White — <code className="text-xs">#F5F7F6</code></div>
          <p className="text-xs text-gray-500 mt-3">Typography: Poppins / Inter (system fallback)</p>
        </div>
      </div>
    </div>
  );
}