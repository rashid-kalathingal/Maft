import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Layers, ShieldCheck, Package } from "lucide-react";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function About() {
  const { settings, products, categories } = useData();
  const wa = buildWhatsAppUrl(settings.whatsappNumber, `Hello ${settings.businessName}, I'd like to know more about your products.`);

  return (
    <div>
      <section className="bg-surface py-14">
        <div className="container-app">
          <nav className="text-sm text-muted">
            <Link to="/" className="hover:text-accent">Home</Link> <span className="px-1">/</span> About
          </nav>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-primary">About MAFT MARKETING</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
            MAFT MARKETING is your trusted partner for furniture hardware and upholstery supplies,
            based in Manjeri, Malappuram, Kerala. We supply recliner mechanisms, sofa and furniture
            legs, fittings, springs, fabrics, adhesives and everything in between — for furniture
            manufacturers, workshops and retailers.
          </p>
        </div>
      </section>

      <section className="container-app grid gap-5 py-14 sm:grid-cols-3">
        {[
          { icon: Layers, v: `${products.length}+`, l: "Catalogue products" },
          { icon: Package, v: `${categories.length}`, l: "Product categories" },
          { icon: ShieldCheck, v: "Quality", l: "Focused supplies" },
        ].map((s) => (
          <div key={s.l} className="card p-6 text-center">
            <s.icon className="mx-auto h-8 w-8 text-accent" />
            <p className="mt-3 text-2xl font-extrabold text-primary">{s.v}</p>
            <p className="text-sm text-muted">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="container-app pb-14">
        <div className="card grid gap-8 p-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">What we offer</h2>
            <ul className="mt-4 space-y-2.5 text-ink-soft">
              {[
                "Manual & motorised recliner mechanisms and accessories",
                "A wide range of sofa & furniture legs in every finish",
                "Sofa and bed fittings, hinges and connectors",
                "Springs, buttons, belts and upholstery components",
                "Fabrics, wadding, fibre, piping and rexin",
                "Screws, staple pins, brad nails and adhesives",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-surface p-6">
            <h3 className="font-bold text-primary">Visit or contact us</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> {settings.address}</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-accent" /> {settings.phonePrimary}</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-accent" /> {settings.phoneSecondary}</li>
            </ul>
            <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-5 w-full">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
