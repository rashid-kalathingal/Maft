import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import type { Category } from "@/types";
import { slugify, uid } from "@/lib/utils";

export function Categories() {
  const { categories, products, saveCategory, deleteCategory } = useData();
  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const count = (id: string) => products.filter((p) => p.categoryId === id).length;
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-primary">Categories</h1>
          <p className="text-sm text-muted">{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Category</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-surface text-2xl">{c.icon}</span>
              <div className="flex gap-1">
                <button onClick={() => setEditing(c)} className="rounded p-1.5 text-muted hover:bg-surface hover:text-accent" title="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setToDelete(c)} className="rounded p-1.5 text-muted hover:bg-danger/10 hover:text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <h3 className="mt-3 font-bold text-primary">{c.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{c.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-ink-soft">{count(c.id)} products</span>
              {c.isActive ? <span className="badge bg-success/10 text-success">Active</span> : <span className="badge bg-muted/10 text-muted">Inactive</span>}
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <CategoryModal
          category={editing}
          existing={categories}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={(c) => { saveCategory(c); toast.success("Category saved."); setAdding(false); setEditing(null); }}
        />
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete category?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
            <button onClick={() => {
              if (!toDelete) return;
              const ok = deleteCategory(toDelete.id);
              if (ok) toast.success("Category deleted.");
              else toast.error("This category has products — reassign them first.");
              setToDelete(null);
            }} className="btn-danger">Delete</button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete <b>{toDelete?.name}</b>?
          {toDelete && count(toDelete.id) > 0 && (
            <span className="mt-2 block rounded-lg bg-danger/5 px-3 py-2 text-danger">Contains {count(toDelete.id)} product(s). Deletion will be blocked.</span>
          )}
        </p>
      </Modal>
    </div>
  );
}

function CategoryModal({ category, existing, onClose, onSave }: { category: Category | null; existing: Category[]; onClose: () => void; onSave: (c: Category) => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "📦");
  const [sortOrder, setSort] = useState(category?.sortOrder ?? existing.length + 1);
  const [active, setActive] = useState(category?.isActive ?? true);

  const save = () => {
    if (!name.trim()) return toast.error("Category name is required.");
    const finalSlug = (slug.trim() || slugify(name));
    const dup = existing.some((c) => c.id !== category?.id && c.slug === finalSlug);
    if (dup) return toast.error("A category with this slug already exists.");
    onSave({
      id: category?.id ?? uid("cat"),
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      icon: icon.trim() || "📦",
      sortOrder,
      isActive: active,
    });
  };

  return (
    <Modal open onClose={onClose} title={category ? "Edit Category" : "Add Category"}
      footer={<div className="flex justify-end gap-3"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={save} className="btn-primary">Save</button></div>}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="label">Name <span className="text-danger">*</span></label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Icon</label>
            <input className="input w-20 text-center text-lg" value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={2} />
          </div>
        </div>
        <div>
          <label className="label">Slug <span className="font-normal text-muted">· auto from name if blank</span></label>
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name)} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-20 resize-y" value={description} onChange={(e) => setDescription(e.target.value)} />
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
