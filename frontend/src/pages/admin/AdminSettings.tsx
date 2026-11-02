import { useEffect, useRef, useState } from "react";
import { Save, Upload, Trash2, Check, HardDrive, FileImage, Database, RefreshCw } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import type { Settings } from "@/types";
import { cn } from "@/lib/utils";
import { api, apiEnabled } from "@/services/api";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, optimizeImageFile, fileToResizedDataUrl } from "@/lib/imageUpload";

const TABS = ["General", "Branding", "WhatsApp", "Catalogue", "Storage"] as const;
type Tab = (typeof TABS)[number];

function formatBytes(n: number): string {
  if (!n || n < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

const FAVICON_LOCK_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Set the browser tab favicon at runtime. */
function applyFavicon(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

export function AdminSettings() {
  const { settings, saveSettings } = useData();
  const [tab, setTab] = useState<Tab>("General");
  const [form, setForm] = useState<Settings>(settings);
  const [uploading, setUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setForm({ ...form, [key]: value });
  const save = () => { saveSettings(form); toast.success("Settings saved."); };

  // Storage usage
  type Usage = { usedBytes: number; limitBytes: number; freeBytes: number; fileCount: number; percentUsed: number; source: string };
  const [usage, setUsage] = useState<Usage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const loadUsage = async () => {
    if (!apiEnabled) return;
    setUsageLoading(true);
    try {
      setUsage(await api.getStorageUsage());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load storage usage.");
    } finally {
      setUsageLoading(false);
    }
  };
  useEffect(() => {
    if (tab === "Storage" && !usage) loadUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Optimize (resize + WebP) then upload to Supabase when connected, else inline data URL.
  const uploadImage = async (file: File, maxDim = 512) => {
    const optimized = await optimizeImageFile(file, { maxDim, quality: 0.9 });
    return apiEnabled ? api.uploadImage(optimized) : fileToResizedDataUrl(file, maxDim, 0.9);
  };

  const onLogoFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Image too large (max 8MB).");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      // Keep the current logo in history (deduped) so it can be re-selected later.
      const history = Array.from(new Set([form.logoUrl, ...(form.logoHistory ?? [])].filter(Boolean) as string[]))
        .filter((u) => u !== url)
        .slice(0, 8);
      const next = { ...form, logoUrl: url, logoHistory: history };
      setForm(next);
      saveSettings(next); // apply immediately so header/footer/admin update
      toast.success("Brand logo updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload the image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Re-select a previously used logo.
  const selectLogo = (url: string) => {
    if (url === form.logoUrl) return;
    const history = Array.from(new Set([form.logoUrl, ...(form.logoHistory ?? [])].filter(Boolean) as string[]))
      .filter((u) => u !== url)
      .slice(0, 8);
    const next = { ...form, logoUrl: url, logoHistory: history };
    setForm(next);
    saveSettings(next);
    toast.success("Brand logo updated.");
  };

  const resetLogo = () => {
    const history = Array.from(new Set([form.logoUrl, ...(form.logoHistory ?? [])].filter(Boolean) as string[])).slice(0, 8);
    const next = { ...form, logoUrl: undefined, logoHistory: history };
    setForm(next);
    saveSettings(next);
    toast.info("Reverted to the default logo.");
  };

  // Days remaining before the favicon may be changed again (0 = allowed now).
  const faviconLockDaysLeft = (() => {
    if (!form.faviconUpdatedAt) return 0;
    const elapsed = Date.now() - new Date(form.faviconUpdatedAt).getTime();
    const left = Math.ceil((FAVICON_LOCK_DAYS * DAY_MS - elapsed) / DAY_MS);
    return left > 0 ? left : 0;
  })();

  const onFaviconFile = async (file?: File) => {
    if (!file) return;
    if (faviconLockDaysLeft > 0) {
      return toast.error(`Favicon can only be changed once every ${FAVICON_LOCK_DAYS} days. Try again in ${faviconLockDaysLeft} day(s).`);
    }
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Image too large (max 8MB).");
    setFaviconUploading(true);
    try {
      const url = await uploadImage(file, 256);
      const next = { ...form, faviconUrl: url, faviconUpdatedAt: new Date().toISOString() };
      setForm(next);
      saveSettings(next);
      applyFavicon(url); // update the browser tab immediately
      toast.success("Favicon updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload the favicon.");
    } finally {
      setFaviconUploading(false);
      if (faviconRef.current) faviconRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-primary tracking-tight">Settings</h1>

      <div className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === t ? "border-accent text-primary" : "border-transparent text-muted hover:text-ink")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <div className="card space-y-5 p-6">
          <h2 className="text-lg font-bold text-primary">General Information</h2>
          <Row label="Business Name"><input className="input" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} /></Row>
          <Row label="Tagline"><input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Row>
          <Row label="Address"><input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} /></Row>
          <Row label="Primary Phone"><input className="input" value={form.phonePrimary} onChange={(e) => set("phonePrimary", e.target.value)} /></Row>
          <Row label="Secondary Phone"><input className="input" value={form.phoneSecondary} onChange={(e) => set("phoneSecondary", e.target.value)} /></Row>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Branding" && (
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="card space-y-6 p-6">
            <div>
              <h2 className="text-lg font-bold text-primary">Brand Logo</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Upload your logo (PNG with transparency works best). It replaces the default logo across the
                header, footer and admin, and applies everywhere as soon as you upload or select one.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-32 w-48 items-center justify-center overflow-hidden rounded-xl border-2 border-line bg-gradient-to-br from-surface to-surface/50 shadow-sm">
                <img src={form.logoUrl || "/logo-full.png"} alt="Current logo" className="max-h-24 max-w-[10rem] object-contain" />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary w-fit shadow-md">
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

            {/* Previously uploaded logos — click to re-select */}
            {(form.logoHistory?.length ?? 0) > 0 && (
              <div>
                <p className="label">Previously uploaded — click to use again</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {form.logoHistory!.map((url) => {
                    const current = url === form.logoUrl;
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => selectLogo(url)}
                        className={cn(
                          "relative flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg border-2 bg-surface transition-colors",
                          current ? "border-accent" : "border-line hover:border-accent/50",
                        )}
                        title={current ? "Currently in use" : "Use this logo"}
                      >
                        <img src={url} alt="Previous logo" className="max-h-12 max-w-[5.5rem] object-contain" />
                        {current && (
                          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} className="hidden" onChange={(e) => onLogoFile(e.target.files?.[0])} />
          </div>

          {/* Favicon */}
          <div className="card space-y-6 p-6">
            <div>
              <h2 className="text-lg font-bold text-primary">Favicon</h2>
              <p className="mt-2 text-sm text-ink-soft">
                The small icon shown in the browser tab. Use a square image (PNG, 32–256px).
                For stability, the favicon can only be changed <b>once every {FAVICON_LOCK_DAYS} days</b>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-line bg-gradient-to-br from-surface to-surface/50 shadow-sm">
                <img src={form.faviconUrl || "/logo-mark.png"} alt="Current favicon" className="max-h-14 max-w-[3.5rem] object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => faviconRef.current?.click()} disabled={faviconUploading || faviconLockDaysLeft > 0} className="btn-primary w-fit shadow-md disabled:opacity-50">
                  <Upload className="h-4 w-4" /> {faviconUploading ? "Uploading…" : "Change Favicon"}
                </button>
                {faviconLockDaysLeft > 0 ? (
                  <span className="text-xs font-medium text-amber-600">
                    Locked — changeable again in {faviconLockDaysLeft} day(s).
                  </span>
                ) : (
                  <span className="text-xs text-muted">
                    {form.faviconUrl ? "Custom favicon in use" : "Default favicon in use"}
                    {form.faviconUpdatedAt && ` · last changed ${new Date(form.faviconUpdatedAt).toLocaleDateString()}`}
                  </span>
                )}
              </div>
            </div>

            <input ref={faviconRef} type="file" accept={ACCEPTED_IMAGE_TYPES} className="hidden" onChange={(e) => onFaviconFile(e.target.files?.[0])} />
          </div>
        </div>
      )}

      {tab === "WhatsApp" && (
        <div className="card space-y-5 p-6">
          <h2 className="text-lg font-bold text-primary">WhatsApp Integration</h2>
          <Row label="WhatsApp Number" hint="Country code + number, digits only (e.g. 919048687010)">
            <input className="input" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/[^\d]/g, ""))} />
          </Row>
          <div className="rounded-xl bg-gradient-to-r from-surface to-surface/50 px-4 py-3 text-sm text-muted">
            Cart enquiries open <span className="font-mono font-semibold text-primary">https://wa.me/{form.whatsappNumber || "…"}</span> with the prepared message.
          </div>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Catalogue" && (
        <div className="card space-y-5 p-6">
          <h2 className="text-lg font-bold text-primary">Catalogue Options</h2>
          <Row label="Products Per Page">
            <input type="number" min={4} max={48} className="input w-28" value={form.productsPerPage} onChange={(e) => set("productsPerPage", parseInt(e.target.value, 10) || 16)} />
          </Row>
          <div className="rounded-xl bg-gradient-to-r from-surface to-surface/50 px-4 py-3 text-sm text-muted">
            Prices are disabled because the catalogue has no confirmed pricing — enquiries go through WhatsApp.
          </div>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Storage" && (
        <div className="card space-y-6 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary"><HardDrive className="h-5 w-5 text-accent" /> Storage Usage</h2>
              <p className="mt-1 text-sm text-ink-soft">Image uploads count towards your storage quota.</p>
            </div>
            <button onClick={loadUsage} disabled={usageLoading} className="btn-outline text-sm">
              <RefreshCw className={cn("h-4 w-4", usageLoading && "animate-spin")} /> Refresh
            </button>
          </div>

          {!apiEnabled ? (
            <div className="rounded-xl bg-surface px-4 py-3 text-sm text-muted">Storage stats are available when connected to the backend.</div>
          ) : usage ? (
            <>
              {/* Usage bar */}
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-2xl font-extrabold text-primary">{formatBytes(usage.usedBytes)}</span>
                  <span className="text-sm text-muted">of {formatBytes(usage.limitBytes)} used</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      usage.percentUsed > 90 ? "bg-danger" : usage.percentUsed > 70 ? "bg-amber-500" : "bg-gradient-to-r from-accent to-accent-dark",
                    )}
                    style={{ width: `${Math.max(usage.percentUsed, usage.usedBytes > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">{usage.percentUsed}% used</p>
              </div>

              {/* Stat tiles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface/50 p-4">
                  <Database className="h-5 w-5 text-accent" />
                  <p className="mt-2 text-xl font-extrabold text-primary">{formatBytes(usage.freeBytes)}</p>
                  <p className="text-xs text-muted">Remaining</p>
                </div>
                <div className="rounded-xl border border-line bg-surface/50 p-4">
                  <FileImage className="h-5 w-5 text-accent" />
                  <p className="mt-2 text-xl font-extrabold text-primary">{usage.fileCount}</p>
                  <p className="text-xs text-muted">Files stored</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted">
              {usageLoading ? "Calculating storage usage…" : "No data."}
            </div>
          )}
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
