import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Palette,
  Ruler,
  MessageSquare,
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
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const current = nav.find((n) => location.pathname.startsWith(n.to));
  const initial = (session?.email?.[0] ?? "A").toUpperCase();

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <Link to="/admin/dashboard" className="flex items-center gap-3 px-5 py-5">
        <img src="/logo-full.png" alt="MAFT MARKETING" className="h-10 w-auto object-contain brightness-0 invert" />
        <span className="border-l border-white/15 pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-[#deb887]">
          Admin<br />Portal
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Menu</p>
        <div className="space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <n.icon className="h-4 w-4 shrink-0" />
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User + actions */}
      <div className="border-t border-white/10 px-3 py-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#a86a30] to-[#5e3813] text-sm font-bold text-white">{initial}</span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{session?.email ?? "Admin"}</p>
            <p className="text-[11px] text-white/45">Administrator</p>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white">
          <ExternalLink className="h-4 w-4" /> View Website
        </Link>
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );

  const sidebarClasses = "flex h-full w-64 shrink-0 flex-col bg-gradient-to-b from-[#161d28] via-[#141a24] to-[#120f0c]";

  return (
    <div className="admin-shell flex min-h-screen bg-[#f4f6f8]">
      {/* Desktop sidebar */}
      <aside className={cn("sticky top-0 hidden h-screen lg:flex", sidebarClasses)}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className={cn("absolute left-0 top-0", sidebarClasses)}>
            <button onClick={() => setOpen(false)} className="absolute right-3 top-5 text-white/60 hover:text-white" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e7eaef] bg-white/85 px-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] backdrop-blur-md sm:px-7">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-surface lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Admin</span>
            <span className="text-[#cdd3dc]">/</span>
            <span className="font-bold text-primary">{current?.label ?? "Dashboard"}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-ink">{session?.email}</p>
              <p className="text-[11px] text-muted">Administrator</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#a86a30] to-[#5e3813] text-sm font-bold text-white shadow-sm">{initial}</span>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
