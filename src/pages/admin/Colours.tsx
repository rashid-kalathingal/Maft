import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import { Swatch } from "@/components/ui/Swatch";
import type { Colour } from "@/types";
import { uid } from "@/lib/utils";

export function Colours() {
  const { colours, products, saveColour, deleteColour } = useData();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Colour | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Colour | null>(null);

  const usage = (id: string) => products.filter((p) => p.variants.some((v) => v.colourId === id)).length;
  const filtered = colours.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-primary">Colours</h1>
          <p className="text-sm text-muted">{colours.length} colours in the master list</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Colour</button>
      </div>

      <div className="card p-4">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search colours…" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Swatch</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Hex</th>
              <th className="px-4 py-3 font-semibold">Used in</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-surface/50">
                <td className="px-4 py-3"><Swatch colour={c} size={24} /></td>
                <td className="px-4 py-3 font-semibold text-primary">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {c.hexCode}{c.secondaryHexCode && ` / ${c.secondaryHexCode}`}
                </td>
                <td className="px-4 py-3 text-ink-soft">{usage(c.id)} products</td>
                <td className="px-4 py-3">
                  {c.isActive ? <span className="badge bg-success/10 text-success">Active</span> : <span className="badge bg-muted/10 text-muted">Inactive</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(c)} className="rounded p-1.5 text-muted hover:bg-surface hover:text-accent" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setToDelete(c)} className="rounded p-1.5 text-muted hover:bg-danger/10 hover:text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <ColourModal
          colour={editing}
          existing={colours}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={(c) => { saveColour(c); toast.success("Colour saved."); setAdding(false); setEditing(null); }}
        />
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete colour?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
            <button
              onClick={() => {
                if (!toDelete) return;
                const ok = deleteColour(toDelete.id);
                if (ok) toast.success("Colour deleted.");
                else toast.error("This colour is used by products — reassign them first.");
                setToDelete(null);
              }}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete <b>{toDelete?.name}</b>?
          {toDelete && usage(toDelete.id) > 0 && (
            <span className="mt-2 block rounded-lg bg-danger/5 px-3 py-2 text-danger">
              Warning: used by {usage(toDelete.id)} product(s). Deletion will be blocked.
            </span>
          )}
        </p>
      </Modal>
    </div>
  );
}

function ColourModal({ colour, existing, onClose, onSave }: { colour: Colour | null; existing: Colour[]; onClose: () => void; onSave: (c: Colour) => void }) {
  const [name, setName] = useState(colour?.name ?? "");
  const [hex, setHex] = useState(colour?.hexCode ?? "#b08d57");
  const [composite, setComposite] = useState(!!colour?.secondaryHexCode);
  const [hex2, setHex2] = useState(colour?.secondaryHexCode ?? "#c9a227");
  const [active, setActive] = useState(colour?.isActive ?? true);

  const save = () => {
    if (!name.trim()) return toast.error("Colour name is required.");
    const dup = existing.some((c) => c.id !== colour?.id && c.name.toLowerCase() === name.trim().toLowerCase());
    if (dup) return toast.error("A colour with this name already exists.");
    onSave({
      id: colour?.id ?? uid("col"),
      name: name.trim(),
      hexCode: hex,
      secondaryHexCode: composite ? hex2 : undefined,
      isActive: active,
    });
  };

  return (
    <Modal open onClose={onClose} title={colour ? "Edit Colour" : "Add Colour"} size="sm"
      footer={<div className="flex justify-end gap-3"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={save} className="btn-primary">Save</button></div>}>
      <div className="space-y-4">
        <div>
          <label className="label">Colour Name <span className="text-danger">*</span></label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rose Gold" />
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="label">Primary</label>
            <input type="color" className="h-10 w-16 cursor-pointer rounded border border-line" value={hex} onChange={(e) => setHex(e.target.value)} />
          </div>
          <label className="mb-2 flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={composite} onChange={(e) => setComposite(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" /> Two-tone
          </label>
          {composite && (
            <div>
              <label className="label">Secondary</label>
              <input type="color" className="h-10 w-16 cursor-pointer rounded border border-line" value={hex2} onChange={(e) => setHex2(e.target.value)} />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" /> Active
        </label>
        <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
          <Swatch colour={{ id: "p", name, hexCode: hex, secondaryHexCode: composite ? hex2 : undefined, isActive: true }} size={32} />
          <span className="text-sm font-medium text-ink">{name || "Preview"}</span>
        </div>
      </div>
    </Modal>
  );
}
