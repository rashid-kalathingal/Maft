import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Palette,
  Ruler,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/stores/useAuth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/colours", label: "Colours", icon: Palette },
  { to: "/admin/sizes", label: "Sizes", icon: Ruler },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const current = nav.find((n) => location.pathname.startsWith(n.to));

  const SidebarContent = () => (
    <>
      <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-5 py-5">
        <img src="/logo-full.png" alt="MAFT MARKETING" className="h-11 w-auto object-contain brightness-0 invert" />
        <span className="border-l border-white/15 pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-accent">
          Admin<br />Portal
        </span>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <n.icon className="h-4 w-4" /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View Website
        </Link>
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-danger/20 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-shell flex min-h-screen bg-[#f4f6f8]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#17212f] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-[#17212f]">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 text-white/70" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e3e8ee] bg-white px-4 sm:px-7">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft hover:bg-surface lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-muted">Admin</p>
            <h1 className="text-sm font-bold text-primary">{current?.label ?? "Dashboard"}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-ink">{session?.email}</p>
              <p className="text-[11px] text-muted">Administrator</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-accent">A</span>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
