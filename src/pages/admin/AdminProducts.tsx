import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Star,
} from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import { productInStock, productTotalStock } from "@/lib/catalogue";
import { formatDate, cn } from "@/lib/utils";

const PER_PAGE = 12;

export function AdminProducts() {
  const { products, categories, deleteProduct, deleteProducts, setProductsActive, duplicateProduct } = useData();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(n) || p.sku.toLowerCase().includes(n));
    }
    if (cat !== "all") list = list.filter((p) => p.categoryId === cat);
    if (status !== "all") list = list.filter((p) => (status === "active" ? p.isActive : !p.isActive));
    if (stock !== "all") list = list.filter((p) => (stock === "in" ? productInStock(p) : !productInStock(p)));
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [products, q, cat, status, stock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const allSelected = pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) pageItems.forEach((p) => next.delete(p.id));
    else pageItems.forEach((p) => next.add(p.id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectedIds = [...selected];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-primary">Products</h1>
          <p className="text-sm text-muted">{filtered.length} of {products.length} products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary"><Plus className="h-4 w-4" /> Add Product</Link>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name or SKU…" className="input pl-9" />
        </div>
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="input !w-auto">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input !w-auto">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }} className="input !w-auto">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Bulk bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="text-sm font-semibold text-primary">{selectedIds.length} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <button onClick={() => { setProductsActive(selectedIds, true); toast.success("Activated."); }} className="btn-outline text-sm">Activate</button>
            <button onClick={() => { setProductsActive(selectedIds, false); toast.success("Deactivated."); }} className="btn-outline text-sm">Deactivate</button>
            <button onClick={() => setBulkDelete(true)} className="btn-danger text-sm"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            <button onClick={() => setSelected(new Set())} className="btn-ghost text-sm">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-line text-accent" aria-label="Select all" /></th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Variants</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageItems.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted">No products match your filters.</td></tr>
              )}
              {pageItems.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                const inStock = productInStock(p);
                return (
                  <tr key={p.id} className={cn("hover:bg-surface/50", selected.has(p.id) && "bg-accent/5")}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} className="h-4 w-4 rounded border-line text-accent" aria-label={`Select ${p.name}`} /></td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">{p.name}</p>
                      <p className="text-xs text-muted">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{cat?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-soft">{p.variants.length || "—"}</td>
                    <td className="px-4 py-3">
                      {inStock
                        ? <span className="text-ink-soft">{productTotalStock(p)}</span>
                        : <span className="badge bg-danger/10 text-danger">Out</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                        {p.isActive
                          ? <span className="badge bg-success/10 text-success">Active</span>
                          : <span className="badge bg-muted/10 text-muted">Inactive</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(p.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/products/${p.slug}`} target="_blank" className="rounded p-1.5 text-muted hover:bg-surface hover:text-ink" title="View"><Eye className="h-4 w-4" /></Link>
                        <Link to={`/admin/products/${p.id}/edit`} className="rounded p-1.5 text-muted hover:bg-surface hover:text-accent" title="Edit"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => { const c = duplicateProduct(p.id); if (c) { toast.success("Duplicated."); navigate(`/admin/products/${c.id}/edit`); } }} className="rounded p-1.5 text-muted hover:bg-surface hover:text-ink" title="Duplicate"><Copy className="h-4 w-4" /></button>
                        <button onClick={() => setToDelete(p.id)} className="rounded p-1.5 text-muted hover:bg-danger/10 hover:text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
            <span className="text-muted">Page {safePage} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="btn-outline text-sm disabled:opacity-40">Previous</button>
              <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="btn-outline text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete single */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete product?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
            <button onClick={() => { if (toDelete) { deleteProduct(toDelete); toast.success("Product deleted."); } setToDelete(null); }} className="btn-danger">Delete</button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete <b>{products.find((p) => p.id === toDelete)?.name}</b>? This can't be undone.
        </p>
      </Modal>

      {/* Bulk delete */}
      <Modal
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        title="Delete selected products?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setBulkDelete(false)} className="btn-outline">Cancel</button>
            <button onClick={() => { deleteProducts(selectedIds); setSelected(new Set()); setBulkDelete(false); toast.success("Products deleted."); }} className="btn-danger">Delete {selectedIds.length}</button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">This permanently removes {selectedIds.length} products.</p>
      </Modal>
    </div>
  );
}
