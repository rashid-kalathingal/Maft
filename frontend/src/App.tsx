import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/PublicLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Toaster } from "@/components/ui/Toaster";
import { Splash } from "@/components/ui/Splash";
import { useAuth } from "@/stores/useAuth";
import { useData } from "@/stores/useData";

import { Home } from "@/pages/public/Home";
import { Products } from "@/pages/public/Products";
import { ProductDetail } from "@/pages/public/ProductDetail";
import { Cart } from "@/pages/public/Cart";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";

import { Login } from "@/pages/admin/Login";
import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { ProductForm } from "@/pages/admin/ProductForm";
import { Categories } from "@/pages/admin/Categories";
import { Colours } from "@/pages/admin/Colours";
import { Sizes } from "@/pages/admin/Sizes";
import { Inquiries } from "@/pages/admin/Inquiries";
import { AdminSettings } from "@/pages/admin/AdminSettings";

function AdminIndex() {
  const session = useAuth((s) => s.session);
  return <Navigate to={session ? "/admin/dashboard" : "/admin/login"} replace />;
}

function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-primary">Page not found</h1>
      <p className="mt-2 text-ink-soft">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}

/** How long (ms) the splash screen shows on boot. Data keeps loading behind it;
 *  pages show skeletons until it arrives, so this stays short. */
const SPLASH_MS = 900;

export default function App() {
  const hydrateFromApi = useData((s) => s.hydrateFromApi);
  const faviconUrl = useData((s) => s.settings.faviconUrl);
  const [splashDone, setSplashDone] = useState(false);

  // When VITE_API_URL is set, load the live catalogue from the backend on startup
  // (no-op otherwise, so the localStorage-only mode keeps working).
  useEffect(() => {
    hydrateFromApi();
  }, [hydrateFromApi]);

  // Show the splash for a short brand moment, then reveal the app (data loads
  // behind it; list pages show skeletons until it arrives).
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // Apply a custom favicon (set in Settings → Branding) to the browser tab.
  useEffect(() => {
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  if (!splashDone) return <Splash />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/colours" element={<Colours />} />
          <Route path="/admin/sizes" element={<Sizes />} />
          <Route path="/admin/inquiries" element={<Inquiries />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
