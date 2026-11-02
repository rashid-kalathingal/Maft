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
import { formatDate } from "@/lib/utils";
import { categoryImage } from "@/data/images";
import { InquiriesChart } from "@/components/admin/InquiriesChart";
import { StatsSkeleton } from "@/components/ui/Skeleton";

export function Dashboard() {
  const { products, categories, colours, inquiries } = useData();
  const loading = useData((s) => s.loading);

  const active = products.filter((p) => p.isActive);
  const drafts = products.filter((p) => !p.isActive);
  const featured = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, tone: "text-primary" },
    { label: "Active Products", value: active.length, icon: CheckCircle2, tone: "text-success" },
    { label: "Drafts / Inactive", value: drafts.length, icon: XCircle, tone: "text-danger" },
    { label: "Categories", value: categories.length, icon: FolderTree, tone: "text-accent" },
    { label: "Featured", value: featured.length, icon: Star, tone: "text-amber-500" },
    { label: "New Arrivals", value: newArrivals.length, icon: AlertTriangle, tone: "text-amber-600" },
  ];

  const distribution = categories
    .map((c) => ({ c, count: products.filter((p) => p.categoryId === c.id).length }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  const recent = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Overview of your product catalogue and inventory.</p>
      </div>
      {/* Stat cards */}
      {loading && products.length === 0 ? <StatsSkeleton /> : (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone === 'text-primary' ? 'from-primary/10 to-primary/5' : s.tone === 'text-success' ? 'from-success/10 to-success/5' : s.tone === 'text-danger' ? 'from-danger/10 to-danger/5' : s.tone === 'text-accent' ? 'from-accent/10 to-accent/5' : 'from-amber-500/10 to-amber-500/5'}`}>
              <s.icon className={`h-5 w-5 ${s.tone}`} />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-primary tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-muted uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
      )}

      {/* Enquiries over time */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Enquiries Over Time</h2>
          <span className="badge bg-surface text-muted">{inquiries.length} total</span>
        </div>
        <InquiriesChart inquiries={inquiries} days={30} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category distribution */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Products by Category</h2>
            <span className="badge bg-surface text-muted">{categories.length} categories</span>
          </div>
          <div className="mt-5 space-y-4">
            {distribution.map(({ c, count }) => (
              <div key={c.id} className="group">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink-soft">
                    <span className="h-7 w-7 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
                      <img src={categoryImage(c)} alt="" className="h-full w-full object-cover" />
                    </span>
                    {c.name}
                  </span>
                  <span className="font-bold text-primary">{count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark transition-all duration-500 ease-out"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-primary">Quick Actions</h2>
          <div className="mt-5 space-y-3">
            <Link to="/admin/products/new" className="btn-primary w-full justify-start shadow-md">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
            <Link to="/admin/categories" className="btn-outline w-full justify-start">
              <FolderTree className="h-4 w-4" /> Manage Categories
            </Link>
            <Link to="/admin/colours" className="btn-outline w-full justify-start">
              <Palette className="h-4 w-4" /> Manage Colours
            </Link>
            <Link to="/admin/products" className="btn-outline w-full justify-start">
              <Package className="h-4 w-4" /> View Products
            </Link>
          </div>
          <div className="mt-6 rounded-xl bg-gradient-to-br from-surface to-surface/50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Total Colours</span>
              <span className="font-bold text-primary">{colours.length}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted">Total Variants</span>
              <span className="font-bold text-primary">{products.reduce((n, p) => n + p.variants.length, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently added */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-primary">Recently Added Products</h2>
          <Link to="/admin/products" className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-3">
                      <Link to={`/admin/products/${p.id}/edit`} className="font-semibold text-primary hover:text-accent transition-colors">{p.name}</Link>
                      <p className="mt-0.5 text-xs text-muted">{p.sku}</p>
                    </td>
                    <td className="px-6 py-3 text-ink-soft">{cat?.name ?? "—"}</td>
                    <td className="px-6 py-3">
                      {p.isActive
                        ? <span className="badge bg-success/10 text-success">Active</span>
                        : <span className="badge bg-muted/10 text-muted">Inactive</span>}
                    </td>
                    <td className="px-6 py-3 text-muted">{formatDate(p.createdAt)}</td>
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
