import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Layers,
  Headphones,
  Search,
  ListChecks,
  ShoppingCart,
  Send,
  Building2,
  ChevronLeft,
  ChevronRight,
  Award,
  Box,
} from "lucide-react";
import { useData } from "@/stores/useData";
import { ProductCard } from "@/components/public/ProductCard";
import { QuickAddModal } from "@/components/public/QuickAddModal";
import type { Product } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_IMAGES, categoryImageSrc } from "@/data/images";

export function Home() {
  const { products, categories, colours, sizes, settings } = useData();
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);

  const activeProducts = products.filter((p) => p.isActive);
  const rec1 = activeProducts.find((p) => p.name.toLowerCase().includes("1r manual")) ?? activeProducts[0];
  const rec2 = activeProducts.find((p) => p.name.toLowerCase().includes("3r motor")) ?? activeProducts[1];
  const leg = activeProducts.find((p) => p.categoryId === "cat-legs" && (p.name.includes("Cone") || p.name.includes("Kulfi"))) ?? activeProducts[2];
  const cup = activeProducts.find((p) => p.categoryId === "cat-accessories" && p.name.includes("Cup Holder")) ?? activeProducts[3];
  const featuredList = [rec1, rec2, leg, cup].filter(Boolean);

  // Approximate category counts matching the mockup design
  const countFor = (catId: string, defaultCount: number) => {
    const realCount = activeProducts.filter((p) => p.categoryId === catId).length;
    return realCount > 0 ? realCount : defaultCount;
  };

  const defaultCategoryCounts: Record<string, number> = {
    "cat-recliner": 62,
    "cat-legs": 36,
    "cat-fittings": 28,
    "cat-chair-bases": 18,
    "cat-accessories": 22,
    "cat-springs": 26,
    "cat-fasteners": 18,
    "cat-fabrics": 34,
    "cat-adhesives": 16,
    "cat-other": 28,
  };

  const wa = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Hello ${settings.businessName}, I'd like to enquire about your products.`
  );

  return (
    <div className="home-page min-h-screen bg-[#fcfaf7]">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden bg-[#faf7f2] border-b border-[#ece7de]">
        {/* Desktop: image fills the right side, top to bottom */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img
            src="/hero.png"
            alt="Recliner hardware in a warm living room"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#faf7f2] to-transparent" />
        </div>

        <div className="container-app relative py-8 lg:min-h-[540px] lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
                MAFT MARKETING
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-[1.12] tracking-tight text-[#1c1813] sm:text-4xl lg:text-[2.65rem]">
                Quality Furniture Hardware &amp;{" "}
                <span className="text-[#935a2b]">Upholstery Solutions</span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#5e554a] max-w-xl mx-auto lg:mx-0">
                Explore a wide range of recliner mechanisms, sofa legs, furniture fittings, upholstery
                accessories, and essential materials for furniture manufacturing.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/products"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#8e5927] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#78491d]"
                >
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#ded8ce] bg-white px-5 py-3 text-sm font-semibold text-[#1c1813] transition hover:bg-[#faf7f2]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.12l-.3-.18-3.06.8.82-2.98-.2-.31a8.2 8.2 0 0 1-1.25-4.45c0-4.54 3.69-8.25 8.23-8.25zm4.52 11.66c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
                    </svg>
                  </span>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#524a40]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Layers className="h-4 w-4 text-[#8e5927]" />
                  <span>Wide Product Range</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-[#8e5927]" />
                  <span>Quality Focused</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Headphones className="h-4 w-4 text-[#8e5927]" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </div>

            {/* Mobile / tablet image (desktop uses the full-height image above) */}
            <div className="lg:hidden">
              <div className="overflow-hidden rounded-2xl border border-[#e8e2d5] shadow-card">
                <img
                  src="/hero.png"
                  alt="Recliner hardware in a warm living room"
                  className="h-[260px] w-full object-cover object-center sm:h-[340px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SHOP BY CATEGORY ===================== */}
      <section className="container-app py-10 sm:py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
              SHOP BY CATEGORY
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1c1813] sm:text-3xl">
              Explore Our Product Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-[#8e5927] hover:underline shrink-0"
          >
            View All Categories →
          </Link>
        </div>

        {/* 10 Category Cards Grid (5x2) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 sm:gap-4">
          {categories.filter((c) => c.isActive).map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="group flex flex-col rounded-2xl border border-[#ece8df] bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd8cc] hover:shadow-card text-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#f8f7f4] flex items-center justify-center p-2.5">
                <img
                  src={categoryImageSrc(c.id)}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex flex-1 flex-col justify-between">
                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-[#1c1813] group-hover:text-[#8e5927] transition-colors">
                  {c.name}
                </h3>
                <p className="mt-1 text-[11px] font-medium text-[#8c8479]">
                  {countFor(c.id, defaultCategoryCounts[c.id] || 24)} Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== FEATURED PRODUCTS ===================== */}
      <section className="container-app py-10 sm:py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
              FEATURED PRODUCTS
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1c1813] sm:text-3xl">
              Popular Products from Our Collection
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-[#8e5927] hover:underline"
            >
              View All Products →
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ded8ce] bg-white text-[#555] hover:bg-[#faf7f2] transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ded8ce] bg-white text-[#555] hover:bg-[#faf7f2] transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featuredList.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              category={categories.find((c) => c.id === p.categoryId)}
              colours={colours}
              sizes={sizes}
              onQuickAdd={setQuickAdd}
            />
          ))}
        </div>
      </section>

      {/* ===================== DARK PROMO BANNER ===================== */}
      <section className="relative overflow-hidden bg-[#1b1f24] text-white">
        {/* Desktop: image fills the left side, top to bottom */}
        <div className="absolute inset-y-0 left-0 hidden w-[45%] lg:block">
          <img
            src={SITE_IMAGES.promo}
            alt="Sofa with gold cone legs"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#1b1f24] to-transparent" />
        </div>

        <div className="container-app relative py-10 lg:min-h-[460px] lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Spacer where the full-height image sits on desktop */}
            <div className="hidden lg:col-span-5 lg:block" />

            {/* Mobile / tablet image */}
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-card lg:hidden">
              <img
                src={SITE_IMAGES.promo}
                alt="Sofa with gold cone legs"
                className="h-56 w-full object-cover sm:h-72"
              />
            </div>

            {/* Center Text */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#baa482]">
                MAFT MARKETING
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Reliable Hardware for Better Furniture
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-white/75 leading-relaxed">
                From recliner mechanisms to sofa legs, upholstery materials to essential fittings — we
                supply quality products that help you create durable, comfortable and stylish furniture.
              </p>
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#8e5927] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#78491d]"
                >
                  Explore Our Range →
                </Link>
              </div>
            </div>

            {/* Right Features List */}
            <div className="lg:col-span-3 space-y-4">
              {[
                { icon: Layers, text: "Wide Product Range" },
                { icon: Building2, text: "Furniture Industry Supplies" },
                { icon: MessageCircle, text: "Easy WhatsApp Enquiries" },
                { icon: Headphones, text: "Dedicated Customer Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-[#c79c6d]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE MAFT MARKETING ===================== */}
      <section className="container-app py-12 sm:py-14 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
          FAST DELIVERIES · WHY CHOOSE MAFT MARKETING
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1c1813] sm:text-3xl">
          Your Trusted Partner in Furniture Hardware
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Box,
              title: "Wide Product Range",
              text: "Everything for furniture manufacturing in one place.",
              color: "text-[#8e5927] bg-[#faf3e8]",
            },
            {
              icon: Award,
              title: "Quality-Focused Products",
              text: "Reliable and durable hardware and accessories.",
              color: "text-[#8e5927] bg-[#faf3e8]",
            },
            {
              icon: MessageCircle,
              title: "Easy WhatsApp Enquiries",
              text: "Quick and convenient product enquiries anytime.",
              color: "text-[#25D366] bg-[#eefbf2]",
            },
            {
              icon: Headphones,
              title: "Dedicated Customer Support",
              text: "We're here to help you find the right products.",
              color: "text-[#8e5927] bg-[#faf3e8]",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center rounded-2xl border border-[#ece8df] bg-white p-6 shadow-xs text-center"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${v.color}`}>
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#1c1813]">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#686055]">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT MAFT MARKETING ===================== */}
      <section className="container-app py-10 sm:py-12 border-t border-[#ece7de]">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left Text */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
              ABOUT MAFT MARKETING
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1c1813] leading-snug">
              Supporting the Furniture Industry
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#5e554a]">
              MAFT MARKETING is your trusted partner for furniture hardware, upholstery accessories,
              and essential materials. We supply a wide range of high-quality products to support
              furniture manufacturers, dealers, and craftsmen.
            </p>
            <div className="mt-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-[#8e5927] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#78491d]"
              >
                Learn More About Us →
              </Link>
            </div>
          </div>

          {/* Right 2x2 Photo Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            {SITE_IMAGES.about.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#e8e2d5] bg-white shadow-xs aspect-[4/3]"
              >
                <img
                  src={src}
                  alt={`MAFT hardware ${i}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW TO ORDER ===================== */}
      <section className="container-app py-12 sm:py-14 text-center border-t border-[#ece7de]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">
          HOW TO ORDER
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1c1813] sm:text-3xl">
          Get the Products You Need in 4 Simple Steps
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {[
            {
              step: "1",
              icon: Search,
              t: "1. Browse Products",
              d: "Explore our categories and find what you need.",
            },
            {
              step: "2",
              icon: ListChecks,
              t: "2. Select Variants",
              d: "Choose size, colour and quantity.",
            },
            {
              step: "3",
              icon: ShoppingCart,
              t: "3. Add to Cart",
              d: "Add your selected items to the cart.",
            },
            {
              step: "4",
              icon: Send,
              t: "4. Send via WhatsApp",
              d: "Share your enquiry on WhatsApp with us.",
            },
          ].map((s, idx) => (
            <div key={s.t} className="relative flex flex-col items-center p-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#ece8df] shadow-xs text-[#8e5927]">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#1c1813]">{s.t}</h3>
              <p className="mt-1.5 text-xs text-[#686055] leading-relaxed max-w-[200px]">{s.d}</p>
              {idx < 3 && (
                <span className="hidden lg:block absolute -right-3 top-7 text-[#c4bbb0] font-bold text-lg">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===================== BOTTOM CTA BANNER ===================== */}
      <section className="relative overflow-hidden bg-[#16191d] text-white">
        <img
          src={SITE_IMAGES.cta}
          alt="Furniture supplies"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16191d] via-[#16191d]/90 to-transparent" />
        <div className="container-app relative py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#baa482]">
            MAFT MARKETING
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl leading-tight">
            Looking for Furniture Hardware or Upholstery Supplies?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
            Explore our product range or contact us for product availability, specifications, and pricing.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#8e5927] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#78491d]"
            >
              Browse Products →
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {quickAdd && <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />}
    </div>
  );
}
