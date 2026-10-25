import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "@/stores/useToast";

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
    <div className="container-app py-8">
      <nav className="text-sm text-muted">
        <Link to="/" className="hover:text-accent">Home</Link> <span className="px-1">/</span> Contact
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary">Contact MAFT MARKETING</h1>
      <p className="mt-2 text-ink-soft">Reach out for product availability, specifications and pricing.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-bold text-primary"><MapPin className="h-5 w-5 text-accent" /> Location</h2>
            <p className="mt-2 text-ink-soft">{settings.address}</p>
          </div>
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-bold text-primary"><Phone className="h-5 w-5 text-accent" /> Phone</h2>
            <ul className="mt-3 space-y-2">
              {contacts.map((c) => (
                <li key={c.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{c.label}</span>
                  <a href={`tel:${c.value.replace(/\s/g, "")}`} className="font-semibold text-ink hover:text-accent">{c.value}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={sendWhatsApp} className="card p-6">
          <h2 className="font-bold text-primary">Send us an enquiry</h2>
          <p className="mt-1 text-sm text-muted">This opens WhatsApp with your message prepared.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label">Name <span className="text-danger">*</span></label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Mobile Number <span className="text-danger">*</span></label>
              <input className="input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} inputMode="tel" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input min-h-24 resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What are you looking for?" />
            </div>
            <button type="submit" className="btn-wa w-full">
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
