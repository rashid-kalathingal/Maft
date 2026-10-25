import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/PublicLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Toaster } from "@/components/ui/Toaster";
import { useAuth } from "@/stores/useAuth";

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

export default function App() {
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
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
