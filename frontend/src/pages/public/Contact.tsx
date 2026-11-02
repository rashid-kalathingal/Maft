import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Sparkles, Send, Clock } from "lucide-react";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "@/stores/useToast";
import { SITE_IMAGES } from "@/data/images";

export function Contact() {
  const { settings } = useData();
  const [form, setForm] = useState({ name: "", mobile: "", message: "" });

  const sendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error("Please enter your name and mobile number.");
      return;
    }
    const msg =
      `Hello ${settings.businessName},\n\nName: ${form.name}\nMobile: ${form.mobile}\n\n${form.message || "I'd like to enquire about your products."}`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) toast.error("Couldn't open WhatsApp. Please allow pop-ups.");
    else toast.success("WhatsApp opened — review and send your message.");
  };

  const contacts = [
    { label: "Primary", value: settings.phonePrimary },
    { label: "Secondary", value: settings.phoneSecondary },
    { label: "Marketing Wing", value: "+91 9048687010" },
  ];

  return (
    <div className="bg-[#fcfaf7]">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-[#16191d] text-white">
        <img src={SITE_IMAGES.promo} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121417]/95 via-[#16191d]/85 to-[#16191d]/60" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
          aria-hidden
        />
        <div className="container-app relative py-20 sm:py-28">
          <nav className="text-sm text-white/60">
            <Link to="/" className="hover:text-[#deb887]">Home</Link> <span className="px-1">/</span>
            <span className="text-white/80"> Contact</span>
          </nav>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#deb887]">
            <Sparkles className="h-3 w-3" /> We'd love to hear from you
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Contact <span className="text-[#deb887]">MAFT MARKETING</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Reach out for product availability, specifications and pricing — the fastest way to get a
            quote is a quick message on WhatsApp.
          </p>
        </div>
      </section>

      {/* ===================== CONTENT ===================== */}
      <section className="container-app -mt-12 relative z-10 pb-16">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Info column */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-[#ece8df] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-bold text-[#1c1813]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7efe4] text-[#8e5927]"><MapPin className="h-4 w-4" /></span>
                Location
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#686055]">{settings.address}</p>
            </div>

            <div className="rounded-2xl border border-[#ece8df] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-bold text-[#1c1813]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7efe4] text-[#8e5927]"><Phone className="h-4 w-4" /></span>
                Phone
              </h2>
              <ul className="mt-4 space-y-2.5">
                {contacts.map((c) => (
                  <li key={c.label} className="flex items-center justify-between rounded-xl bg-[#faf7f2] px-3 py-2.5 text-sm">
                    <span className="text-[#8c8479]">{c.label}</span>
                    <a href={`tel:${c.value.replace(/\s/g, "")}`} className="font-semibold text-[#1c1813] hover:text-[#8e5927]">{c.value}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#ece8df] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-bold text-[#1c1813]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f7efe4] text-[#8e5927]"><Clock className="h-4 w-4" /></span>
                Business Hours
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#686055]">
                Mon – Sat · 9:00 AM – 7:00 PM<br />
                <span className="text-[#8c8479]">Closed on Sundays & public holidays</span>
              </p>
            </div>
          </div>

          {/* Enquiry form */}
          <form onSubmit={sendWhatsApp} className="rounded-2xl border border-[#ece8df] bg-white p-7 shadow-sm lg:col-span-3">
            <h2 className="text-xl font-extrabold text-[#1c1813]">Send us an enquiry</h2>
            <p className="mt-1 text-sm text-[#686055]">This opens WhatsApp with your message ready to send.</p>
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name <span className="text-danger">*</span></label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Mobile Number <span className="text-danger">*</span></label>
                  <input className="input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} inputMode="tel" placeholder="e.g. 98765 43210" />
                </div>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-32 resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What are you looking for?" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1eb455]">
                <MessageCircle className="h-4 w-4" /> Send via WhatsApp
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8c8479]">
                <Send className="h-3 w-3" /> You review and send the message yourself — no spam, ever.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
