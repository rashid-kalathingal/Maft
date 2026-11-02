import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import type { Category } from "@/types";
import { slugify, uid } from "@/lib/utils";
import { api, apiEnabled } from "@/services/api";
import { categoryImage } from "@/data/images";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, optimizeImageFile, fileToResizedDataUrl } from "@/lib/imageUpload";

export function Categories() {
  const { categories, products, saveCategory, deleteCategory } = useData();
  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const count = (id: string) => products.filter((p) => p.categoryId === id).length;
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted">{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary shadow-md">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <div key={c.id} className="card p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-surface to-surface/50 text-2xl shadow-sm">
                <img src={categoryImage(c)} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(c)} className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-accent transition-colors" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setToDelete(c)} className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 font-bold text-primary text-lg">{c.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{c.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink-soft font-medium">{count(c.id)} products</span>
              {c.isActive
                ? <span className="badge bg-success/10 text-success">Active</span>
                : <span className="badge bg-muted/10 text-muted">Inactive</span>}
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
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [sortOrder, setSort] = useState(category?.sortOrder ?? existing.length + 1);
  const [active, setActive] = useState(category?.isActive ?? true);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Image is too large (max 8MB).");
    setUploading(true);
    try {
      // Optimize (resize + WebP) then upload to Supabase; else inline data URL.
      const optimized = await optimizeImageFile(file, { maxDim: 800, quality: 0.82 });
      const url = apiEnabled ? await api.uploadImage(optimized) : await fileToResizedDataUrl(file, 800, 0.82);
      setImageUrl(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
      imageUrl: imageUrl || undefined,
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
        <div>
          <label className="label">Category Image <span className="font-normal text-muted">· overrides the default; shown on the website</span></label>
          <div className="flex items-center gap-3">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-gradient-to-br from-surface to-surface/50 text-2xl">
              {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : icon}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} className="hidden" onChange={(e) => handleFile(e.target.files)} />
              <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="btn-outline">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : imageUrl ? "Replace" : "Upload image"}
              </button>
              {imageUrl && (
                <button type="button" onClick={() => setImageUrl("")} className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline">
                  <X className="h-3.5 w-3.5" /> Remove image
                </button>
              )}
            </div>
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
