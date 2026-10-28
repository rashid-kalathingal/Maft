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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm hover:brightness-105 transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.12l-.3-.18-3.06.8.82-2.98-.2-.31a8.2 8.2 0 0 1-1.25-4.45c0-4.54 3.69-8.25 8.23-8.25zm4.52 11.66c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
            </svg>
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
