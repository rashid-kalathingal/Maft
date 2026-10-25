import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import type { Size, SizeUnit } from "@/types";
import { uid } from "@/lib/utils";

const UNITS: SizeUnit[] = ["inch", "mm", "cm", "m", "custom"];

export function Sizes() {
  const { sizes, products, saveSize, deleteSize } = useData();
  const [editing, setEditing] = useState<Size | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Size | null>(null);

  const usage = (id: string) => products.filter((p) => p.variants.some((v) => v.sizeId === id)).length;
  const sorted = [...sizes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-primary">Sizes</h1>
          <p className="text-sm text-muted">{sizes.length} sizes in the master list</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Size</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Label</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Used in</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((s) => (
              <tr key={s.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-semibold text-primary">{s.label}</td>
                <td className="px-4 py-3 text-ink-soft">{s.value ?? "—"}</td>
                <td className="px-4 py-3 uppercase text-ink-soft">{s.unit}</td>
                <td className="px-4 py-3 text-ink-soft">{s.sortOrder}</td>
                <td className="px-4 py-3 text-ink-soft">{usage(s.id)} products</td>
                <td className="px-4 py-3">
                  {s.isActive ? <span className="badge bg-success/10 text-success">Active</span> : <span className="badge bg-muted/10 text-muted">Inactive</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(s)} className="rounded p-1.5 text-muted hover:bg-surface hover:text-accent" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setToDelete(s)} className="rounded p-1.5 text-muted hover:bg-danger/10 hover:text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <SizeModal
          size={editing}
          existing={sizes}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={(s) => { saveSize(s); toast.success("Size saved."); setAdding(false); setEditing(null); }}
        />
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete size?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
            <button onClick={() => {
              if (!toDelete) return;
              const ok = deleteSize(toDelete.id);
              if (ok) toast.success("Size deleted.");
              else toast.error("This size is used by products — reassign them first.");
              setToDelete(null);
            }} className="btn-danger">Delete</button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete <b>{toDelete?.label}</b>?
          {toDelete && usage(toDelete.id) > 0 && (
            <span className="mt-2 block rounded-lg bg-danger/5 px-3 py-2 text-danger">Used by {usage(toDelete.id)} product(s). Deletion will be blocked.</span>
          )}
        </p>
      </Modal>
    </div>
  );
}

function SizeModal({ size, existing, onClose, onSave }: { size: Size | null; existing: Size[]; onClose: () => void; onSave: (s: Size) => void }) {
  const [label, setLabel] = useState(size?.label ?? "");
  const [value, setValue] = useState<string>(size?.value?.toString() ?? "");
  const [unit, setUnit] = useState<SizeUnit>(size?.unit ?? "inch");
  const [sortOrder, setSort] = useState(size?.sortOrder ?? existing.length + 1);
  const [active, setActive] = useState(size?.isActive ?? true);

  const save = () => {
    if (!label.trim()) return toast.error("Size label is required.");
    const dup = existing.some((s) => s.id !== size?.id && s.label.toLowerCase() === label.trim().toLowerCase());
    if (dup) return toast.error("A size with this label already exists.");
    onSave({
      id: size?.id ?? `size-${uid("s").slice(-5).toUpperCase()}`,
      label: label.trim(),
      value: value.trim() ? parseFloat(value) : undefined,
      unit,
      sortOrder,
      isActive: active,
    });
  };

  return (
    <Modal open onClose={onClose} title={size ? "Edit Size" : "Add Size"} size="sm"
      footer={<div className="flex justify-end gap-3"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={save} className="btn-primary">Save</button></div>}>
      <div className="space-y-4">
        <div>
          <label className="label">Size Label <span className="text-danger">*</span></label>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. 6 Inches" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Numeric Value</label>
            <input className="input" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="6" />
          </div>
          <div>
            <label className="label">Unit</label>
            <select className="input" value={unit} onChange={(e) => setUnit(e.target.value as SizeUnit)}>
              {UNITS.map((u) => <option key={u} value={u}>{u.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Display Order</label>
            <input className="input" type="number" value={sortOrder} onChange={(e) => setSort(parseInt(e.target.value, 10) || 0)} />
          </div>
          <label className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" /> Active
          </label>
        </div>
      </div>
    </Modal>
  );
}
