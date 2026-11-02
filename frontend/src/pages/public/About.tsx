import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  Layers,
  ShieldCheck,
  Package,
  CheckCircle2,
  Sparkles,
  Truck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_IMAGES } from "@/data/images";

export function About() {
  const { settings, products, categories } = useData();
  const wa = buildWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I'd like to know more about your products.`);

  const offers = [
    "Manual & motorised recliner mechanisms and accessories",
    "A wide range of sofa & furniture legs in every finish",
    "Sofa and bed fittings, hinges and connectors",
    "Springs, buttons, belts and upholstery components",
    "Fabrics, wadding, fibre, piping and rexin",
    "Screws, staple pins, brad nails and adhesives",
  ];

  const stats = [
    { icon: Layers, v: `${products.length}+`, l: "Catalogue products" },
    { icon: Package, v: `${categories.length}`, l: "Product categories" },
    { icon: ShieldCheck, v: "Quality", l: "Focused supplies" },
  ];

  const whyUs = [
    { icon: Sparkles, t: "Wide Range", d: "Hundreds of SKUs across every furniture-hardware category." },
    { icon: ShieldCheck, t: "Quality Focused", d: "Dependable supplies trusted by workshops and retailers." },
    { icon: Truck, t: "Bulk & Wholesale", d: "Packed for bulk orders with flexible quantities." },
    { icon: Headphones, t: "Quick Support", d: "Fast replies and quotes directly over WhatsApp." },
  ];

  return (
    <div className="bg-[#fcfaf7]">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-[#16191d] text-white">
        {/* Background image */}
        <img src={SITE_IMAGES.hero} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121417]/95 via-[#16191d]/85 to-[#16191d]/60" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
          aria-hidden
        />
        <div className="container-app relative py-20 sm:py-28">
          <nav className="text-sm text-white/60">
            <Link to="/" className="hover:text-[#deb887]">Home</Link> <span className="px-1">/</span>
            <span className="text-white/80"> About</span>
          </nav>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#deb887]">
            <Sparkles className="h-3 w-3" /> Your Trusted Partner
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            About <span className="text-[#deb887]">MAFT MARKETING</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Based in Manjeri, Malappuram, Kerala, MAFT MARKETING is your trusted partner for furniture
            hardware and upholstery supplies. We supply recliner mechanisms, sofa and furniture legs,
            fittings, springs, fabrics, adhesives and everything in between — for furniture
            manufacturers, workshops and retailers.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8e5927] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9c6530]">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="container-app -mt-10 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l} className="group rounded-2xl border border-[#ece8df] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7efe4] text-[#8e5927] transition-colors group-hover:bg-[#8e5927] group-hover:text-white">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#1c1813]">{s.v}</p>
              <p className="mt-1 text-sm text-[#8c8479]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="container-app py-14 sm:py-16">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e5927]">Why Choose Us</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1c1813] sm:text-3xl">Built for furniture makers</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w) => (
            <div key={w.t} className="group rounded-2xl border border-[#ece8df] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#e0cbb0] hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7efe4] text-[#8e5927] transition-colors group-hover:bg-[#8e5927] group-hover:text-white">
                <w.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#1c1813]">{w.t}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#686055]">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SHOWCASE BAND ===================== */}
      <section className="container-app pb-14">
        <div className="relative overflow-hidden rounded-3xl border border-[#ece8df] shadow-card">
          <img src={SITE_IMAGES.promo} alt="MAFT furniture hardware" loading="lazy" className="h-56 w-full object-cover sm:h-72" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16191d]/90 via-[#16191d]/55 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-7 sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#deb887]">One-stop supplier</p>
            <h2 className="mt-2 max-w-md text-xl font-extrabold leading-tight text-white sm:text-3xl">
              Everything your furniture workshop needs
            </h2>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
              From mechanisms and legs to fabrics and fasteners — sourced for quality and packed for bulk.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== OFFER + CONTACT ===================== */}
      <section className="container-app pb-16">
        <div className="grid gap-6 md:grid-cols-5">
          {/* What we offer */}
          <div className="rounded-2xl border border-[#ece8df] bg-white p-7 shadow-xs md:col-span-3">
            <h2 className="text-2xl font-extrabold text-[#1c1813]">What we offer</h2>
            <p className="mt-2 text-sm text-[#686055]">A complete range of furniture hardware and upholstery materials under one roof.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {offers.map((t) => (
                <li key={t} className="flex items-start gap-2.5 rounded-xl bg-[#faf7f2] p-3 text-sm text-[#3e362c]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8e5927]" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="relative overflow-hidden rounded-2xl bg-[#16191d] p-7 text-white shadow-card md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[#23282e] to-[#121417]" aria-hidden />
            <div className="relative">
              <h3 className="text-lg font-bold">Visit or contact us</h3>
              <p className="mt-1 text-xs text-white/60">We're happy to help with availability and bulk orders.</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#deb887]"><MapPin className="h-4 w-4" /></span>
                  <span className="text-white/85">{settings.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#deb887]"><Phone className="h-4 w-4" /></span>
                  <a href={`tel:${settings.phonePrimary}`} className="text-white/85 hover:text-white">{settings.phonePrimary}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#deb887]"><Phone className="h-4 w-4" /></span>
                  <a href={`tel:${settings.phoneSecondary}`} className="text-white/85 hover:text-white">{settings.phoneSecondary}</a>
                </li>
              </ul>
              <a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1eb455]">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
