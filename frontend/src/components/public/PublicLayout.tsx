import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useData } from "@/stores/useData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function PublicLayout() {
  const { pathname } = useLocation();
  const settings = useData((s) => s.settings);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Hello ${settings.businessName}, I'd like to enquire about your products.`,
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating actions */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink shadow-card transition hover:bg-surface"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="block rounded-full shadow-card transition hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <img src="/whatsapp.png" alt="Chat on WhatsApp" className="h-14 w-14 object-contain" />
        </a>
      </div>
    </div>
  );
}
