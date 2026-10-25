import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import type { Settings } from "@/types";
import { cn } from "@/lib/utils";

const TABS = ["General", "WhatsApp", "Catalogue", "Demo Data"] as const;
type Tab = (typeof TABS)[number];

export function AdminSettings() {
  const { settings, saveSettings, resetDemoData } = useData();
  const [tab, setTab] = useState<Tab>("General");
  const [form, setForm] = useState<Settings>(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setForm({ ...form, [key]: value });
  const save = () => { saveSettings(form); toast.success("Settings saved."); };

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
          <label className="flex items-center gap-2.5 text-sm text-ink-soft">
            <input type="checkbox" checked={form.showStock} onChange={(e) => set("showStock", e.target.checked)} className="h-4 w-4 rounded border-line text-accent" />
            Show stock availability on the website
          </label>
          <Row label="Products Per Page">
            <input type="number" min={4} max={48} className="input w-28" value={form.productsPerPage} onChange={(e) => set("productsPerPage", parseInt(e.target.value, 10) || 16)} />
          </Row>
          <p className="rounded-lg bg-surface px-3 py-2.5 text-xs text-muted">
            Prices are disabled in this demo because the supplied catalogue has no confirmed pricing — enquiries go through WhatsApp.
          </p>
          <SaveBtn onClick={save} />
        </div>
      )}

      {tab === "Demo Data" && (
        <div className="card space-y-4 p-6">
          <h2 className="font-bold text-primary">Reset Demo Data</h2>
          <p className="text-sm text-ink-soft">
            Restore the original seeded products, categories, colours, sizes and settings. This clears any
            products you've added or edited in this browser. Your cart is not affected.
          </p>
          <button onClick={() => setConfirmReset(true)} className="btn-danger w-fit"><RotateCcw className="h-4 w-4" /> Reset Demo Data</button>
        </div>
      )}

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all demo data?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setConfirmReset(false)} className="btn-outline">Cancel</button>
            <button onClick={() => { resetDemoData(); setForm(useData.getState().settings); setConfirmReset(false); toast.success("Demo data reset."); }} className="btn-danger">Reset Everything</button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">This can't be undone. All catalogue changes in this browser will be reverted to the original seed.</p>
      </Modal>
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
