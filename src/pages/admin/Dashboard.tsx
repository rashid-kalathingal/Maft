import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  XCircle,
  FolderTree,
  Star,
  AlertTriangle,
  Plus,
  Palette,
  ArrowRight,
} from "lucide-react";
import { useData } from "@/stores/useData";
import { productInStock, productTotalStock } from "@/lib/catalogue";
import { formatDate } from "@/lib/utils";

export function Dashboard() {
  const { products, categories, colours } = useData();

  const active = products.filter((p) => p.isActive);
  const outOfStock = products.filter((p) => !productInStock(p));
  const featured = products.filter((p) => p.isFeatured);
  const lowStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.isActive && v.stockQuantity > 0 && v.stockQuantity < 15),
  );

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, tone: "text-primary" },
    { label: "Active Products", value: active.length, icon: CheckCircle2, tone: "text-success" },
    { label: "Out of Stock", value: outOfStock.length, icon: XCircle, tone: "text-danger" },
    { label: "Categories", value: categories.length, icon: FolderTree, tone: "text-accent" },
    { label: "Featured", value: featured.length, icon: Star, tone: "text-amber-500" },
    { label: "Low-stock Variants", value: lowStockVariants.length, icon: AlertTriangle, tone: "text-amber-600" },
  ];

  const distribution = categories
    .map((c) => ({ c, count: products.filter((p) => p.categoryId === c.id).length }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  const recent = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="mb-1">
        <h1 className="text-xl font-bold text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Overview of your product catalogue and inventory.</p>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <s.icon className={`h-6 w-6 ${s.tone}`} />
            <p className="mt-3 text-2xl font-extrabold text-primary">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category distribution */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-bold text-primary">Products by Category</h2>
          <div className="mt-4 space-y-3">
            {distribution.map(({ c, count }) => (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{c.icon} {c.name}</span>
                  <span className="font-semibold text-primary">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <h2 className="font-bold text-primary">Quick Actions</h2>
          <div className="mt-4 space-y-2.5">
            <Link to="/admin/products/new" className="btn-primary w-full justify-start"><Plus className="h-4 w-4" /> Add Product</Link>
            <Link to="/admin/categories" className="btn-outline w-full justify-start"><FolderTree className="h-4 w-4" /> Manage Categories</Link>
            <Link to="/admin/colours" className="btn-outline w-full justify-start"><Palette className="h-4 w-4" /> Manage Colours</Link>
            <Link to="/admin/products" className="btn-outline w-full justify-start"><Package className="h-4 w-4" /> View Products</Link>
          </div>
          <div className="mt-5 rounded-lg bg-surface p-3 text-xs text-muted">
            {colours.length} colours · {products.reduce((n, p) => n + p.variants.length, 0)} variants in catalogue.
          </div>
        </div>
      </div>

      {/* Recently added */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-bold text-primary">Recently Added Products</h2>
          <Link to="/admin/products" className="text-sm font-semibold text-accent hover:underline">
            View all <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-surface/50">
                    <td className="px-5 py-3">
                      <Link to={`/admin/products/${p.id}/edit`} className="font-semibold text-primary hover:text-accent">{p.name}</Link>
                      <p className="text-xs text-muted">{p.sku}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{cat?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{productTotalStock(p)}</td>
                    <td className="px-5 py-3">
                      {p.isActive
                        ? <span className="badge bg-success/10 text-success">Active</span>
                        : <span className="badge bg-muted/10 text-muted">Inactive</span>}
                    </td>
                    <td className="px-5 py-3 text-muted">{formatDate(p.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
