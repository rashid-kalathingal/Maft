import { Link } from "react-router-dom";
import { MapPin, Phone, ChevronUp, Instagram, Facebook, Youtube } from "lucide-react";
import { useData } from "@/stores/useData";

export function Footer() {
  const settings = useData((s) => s.settings);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#14171a] text-white/80 border-t border-white/10">
      <div className="container-app py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Logo & About */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {settings.logoUrl ? (
                <span className="flex h-14 items-center justify-center rounded-xl bg-white px-2">
                  <img src={settings.logoUrl} alt="MAFT MARKETING" className="max-h-11 w-auto object-contain" />
                </span>
              ) : (
                <img src="/logo-full.png" alt="MAFT MARKETING" className="h-14 w-auto object-contain brightness-0 invert" />
              )}
              <span className="border-l border-white/15 pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-[#baa482]">
                Your Trusted<br />Partner
              </span>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Your one-stop supplier for furniture hardware, upholstery accessories, and essential materials for furniture manufacturing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#8e5927] hover:text-[#8e5927]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#8e5927] hover:text-[#8e5927]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#8e5927] hover:text-[#8e5927]"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-white/75">
              <li>
                <Link to="/" className="hover:text-[#baa482] transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#baa482] transition">Products</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#baa482] transition">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#baa482] transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#baa482] transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Product Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-white/75">
              <li>
                <Link to="/products?category=recliner-mechanisms" className="hover:text-[#baa482] transition">
                  Recliner Mechanisms
                </Link>
              </li>
              <li>
                <Link to="/products?category=sofa-legs" className="hover:text-[#baa482] transition">
                  Sofa Legs
                </Link>
              </li>
              <li>
                <Link to="/products?category=sofa-bed-fittings" className="hover:text-[#baa482] transition">
                  Fittings &amp; Components
                </Link>
              </li>
              <li>
                <Link to="/products?category=fabrics-materials" className="hover:text-[#baa482] transition">
                  Upholstery Materials
                </Link>
              </li>
              <li>
                <Link to="/products?category=adhesives-packing" className="hover:text-[#baa482] transition">
                  Adhesives &amp; Packing
                </Link>
              </li>
              <li>
                <Link to="/products?category=other-accessories" className="hover:text-[#baa482] transition">
                  Other Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-white/75">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#baa482] shrink-0" />
                <a href="tel:+919495400509" className="hover:text-white transition">
                  +91 9495400509
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#baa482] shrink-0" />
                <a href="tel:+919846260964" className="hover:text-white transition">
                  +91 9846260964
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#baa482] shrink-0" />
                <a href="tel:+919048468700" className="hover:text-white transition">
                  +91 9048468700 (Marketing Wing)
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="h-4 w-4 text-[#baa482] shrink-0 mt-0.5" />
                <span>Manjeri, Malappuram, Kerala</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© 2024 MAFT MARKETING. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8e5927] text-white hover:bg-[#78491d] transition"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
