import { useRef, useState } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import type { Settings } from "@/types";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, fileToResizedDataUrl } from "@/lib/imageUpload";

const TABS = ["General", "Branding", "WhatsApp", "Catalogue"] as const;
type Tab = (typeof TABS)[number];

export function AdminSettings() {
  const { settings, saveSettings } = useData();
  const [tab, setTab] = useState<Tab>("General");
  const [form, setForm] = useState<Settings>(settings);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setForm({ ...form, [key]: value });
  const save = () => { saveSettings(form); toast.success("Settings saved."); };

  const onLogoFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Image too large (max 8MB).");
    setUploading(true);
    try {
      // Keep the logo crisp but small; transparent PNGs stay PNG.
      const dataUrl = await fileToResizedDataUrl(file, 512, 0.9);
      const next = { ...form, logoUrl: dataUrl };
      setForm(next);
      saveSettings(next); // apply immediately so the header/footer update
      toast.success("Brand logo updated.");
    } catch {
      toast.error("Could not process the image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const resetLogo = () => {
    const next = { ...form, logoUrl: undefined };
    setForm(next);
    saveSettings(next);
    toast.info("Reverted to the default logo.");
  };

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-xl font-extrabold text-primary">Settings</h1>

      <div className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("border-b-2 px-4 py-2.5 text-sm font-semibold transition",
              tab === t ? "border-accent text-primary" : "border-transparent text-muted hover:text-ink")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <div className="card space-y-4 p-6">
          <Row label="Business Name"><input className="input" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} /></Row>
          <Row label="Tagline"><input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Row>
          <Row label="Address"><input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} /></Row>
          <Row label="Primary Phone"><input className="input" value={form.phonePrimary} onChange={(e) => set("phonePrimary", e.target.value)} /></Row>
          <Row label="Secondary Phone"><input className="input" value={form.phoneSecondary} onChange={(e) => set("phoneSecondary", e.target.value)} /></Row>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Branding" && (
        <div className="card space-y-5 p-6">
          <div>
            <h2 className="font-bold text-primary">Brand Logo</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Upload your logo (PNG with transparency works best). It replaces the default logo across the
              header, footer and admin. Applies as soon as you upload.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-xl border border-line bg-[#faf7f2]">
              <img src={form.logoUrl || "/logo-full.png"} alt="Current logo" className="max-h-20 max-w-[9rem] object-contain" />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary w-fit">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Logo"}
              </button>
              {form.logoUrl && (
                <button onClick={resetLogo} className="btn-outline w-fit text-sm">
                  <Trash2 className="h-4 w-4" /> Remove (use default)
                </button>
              )}
              <span className="text-xs text-muted">{form.logoUrl ? "Custom logo in use" : "Default logo in use"}</span>
            </div>
          </div>

          <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} className="hidden" onChange={(e) => onLogoFile(e.target.files?.[0])} />
        </div>
      )}

      {tab === "WhatsApp" && (
        <div className="card space-y-4 p-6">
          <Row label="WhatsApp Number" hint="Country code + number, digits only (e.g. 919048687010)">
            <input className="input" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/[^\d]/g, ""))} />
          </Row>
          <p className="rounded-lg bg-surface px-3 py-2.5 text-xs text-muted">
            Cart enquiries open <span className="font-mono">https://wa.me/{form.whatsappNumber || "…"}</span> with the prepared message.
          </p>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Catalogue" && (
        <div className="card space-y-4 p-6">
          <Row label="Products Per Page">
            <input type="number" min={4} max={48} className="input w-28" value={form.productsPerPage} onChange={(e) => set("productsPerPage", parseInt(e.target.value, 10) || 16)} />
          </Row>
          <p className="rounded-lg bg-surface px-3 py-2.5 text-xs text-muted">
            Prices are disabled because the catalogue has no confirmed pricing — enquiries go through WhatsApp.
          </p>
          <SaveBtn onClick={save} />
        </div>
      )}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label} {hint && <span className="font-normal text-muted">· {hint}</span>}</label>
      {children}
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="btn-primary w-fit"><Save className="h-4 w-4" /> Save Changes</button>;
}
