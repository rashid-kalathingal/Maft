import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/stores/useCart";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function Logo({ compact = false }: { compact?: boolean }) {
  const logoUrl = useData((s) => s.settings.logoUrl);
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <img
        src={logoUrl || "/logo-full.png"}
        alt="MAFT MARKETING"
        className={cn("w-auto object-contain", compact ? "h-11" : "h-12 sm:h-14")}
      />
      <span className="hidden border-l border-[#e0dacf] pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-[#8e5927] sm:block">
        Your Trusted<br />Partner
      </span>
    </Link>
  );
}

export function Header() {
  const items = useCart((s) => s.items);
  const { settings } = useData();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const wa = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Hello ${settings.businessName}, I'd like to enquire about your products.`
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/products");
    }
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-all duration-200 border-b",
        scrolled ? "border-[#ece8df] shadow-sm" : "border-[#f1eee7]"
      )}
    >
      <div className="container-app flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "relative py-2 text-sm font-semibold transition-colors",
                isActive ? "text-[#8e5927]" : "text-[#4a4238] hover:text-[#1c1813]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span>Home</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#8e5927]" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/products"
            end={false}
            className={({ isActive }) =>
              cn(
                "relative py-2 text-sm font-semibold transition-colors",
                isActive ? "text-[#8e5927]" : "text-[#4a4238] hover:text-[#1c1813]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span>Products</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#8e5927]" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                "relative py-2 text-sm font-semibold transition-colors",
                isActive ? "text-[#8e5927]" : "text-[#4a4238] hover:text-[#1c1813]"
              )
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                "relative py-2 text-sm font-semibold transition-colors",
                isActive ? "text-[#8e5927]" : "text-[#4a4238] hover:text-[#1c1813]"
              )
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Search, Cart & WhatsApp */}
        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch} className="hidden md:flex items-center">
            <div className="flex h-10 w-56 lg:w-64 items-center overflow-hidden rounded-md border border-[#dfdbd3] bg-white focus-within:border-[#8e5927] focus-within:ring-1 focus-within:ring-[#8e5927]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, Categories..."
                className="h-full w-full px-3 text-xs text-[#222] placeholder:text-[#999] focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-full w-10 shrink-0 items-center justify-center bg-[#8e5927] text-white hover:bg-[#78491d] transition"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Cart Icon with count */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center text-[#2b251e] hover:text-[#8e5927] transition"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8e5927] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>

          {/* WhatsApp green icon */}
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 active:scale-95"
          >
            <img src="/whatsapp.png" alt="Chat on WhatsApp" className="h-10 w-10 object-contain" />
          </a>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#333] hover:bg-[#f5f2eb] lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[84vw] max-w-sm flex-col bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-[#eee] px-4 py-4">
              <Logo compact />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitSearch} className="border-b border-[#eee] p-4">
              <div className="flex h-11 w-full items-center overflow-hidden rounded-md border border-[#dfdbd3]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, Categories..."
                  className="h-full w-full px-3 text-sm focus:outline-none"
                />
                <button type="submit" className="flex h-full w-12 items-center justify-center bg-[#8e5927] text-white">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-1 p-4">
              <NavLink
                to="/"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("rounded-lg px-4 py-3 text-sm font-semibold transition", isActive ? "bg-[#f5efe6] text-[#8e5927]" : "text-[#333] hover:bg-surface")
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("rounded-lg px-4 py-3 text-sm font-semibold transition", isActive ? "bg-[#f5efe6] text-[#8e5927]" : "text-[#333] hover:bg-surface")
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("rounded-lg px-4 py-3 text-sm font-semibold transition", isActive ? "bg-[#f5efe6] text-[#8e5927]" : "text-[#333] hover:bg-surface")
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("rounded-lg px-4 py-3 text-sm font-semibold transition", isActive ? "bg-[#f5efe6] text-[#8e5927]" : "text-[#333] hover:bg-surface")
                }
              >
                Contact
              </NavLink>
            </nav>

            <div className="mt-auto border-t border-[#eee] p-4 space-y-2">
              <a href={wa} target="_blank" rel="noreferrer" className="btn-wa w-full py-3">
                Chat on WhatsApp
              </a>
              <a href={`tel:${settings.phonePrimary.replace(/\s/g, "")}`} className="btn-outline w-full py-3">
                <Phone className="h-4 w-4" /> {settings.phonePrimary}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
