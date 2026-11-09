import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, apiEnabled } from "@/services/api";
import { ShoppingCart, MessageCircle, ChevronRight, Package } from "lucide-react";
import { useData } from "@/stores/useData";
import { useCart } from "@/stores/useCart";
import { toast } from "@/stores/useToast";
import { ProductImage } from "@/components/ui/ProductImage";
import { VariantControls } from "@/components/public/VariantControls";
import { ProductCard } from "@/components/public/ProductCard";
import { QuickAddModal } from "@/components/public/QuickAddModal";
import { useVariantSelection } from "@/lib/useVariantSelection";
import { galleryImages } from "@/data/images";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import type { Product } from "@/types";

export function ProductDetail() {
  const { slug } = useParams();
  // The store holds only slim cards (no specs/variants/full gallery); use it for
  // an instant first paint, then fetch the full product by slug to enrich it.
  const storeProduct = useData((s) => s.products.find((p) => p.slug === slug && p.isActive));
  const [full, setFull] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    setFull(null);
    setNotFound(false);
    if (!slug || !apiEnabled) return;
    api
      .getProduct(slug)
      .then((p) => alive && setFull(p && p.isActive ? p : null))
      .catch(() => alive && setNotFound(true));
    return () => { alive = false; };
  }, [slug]);

  const product = full ?? storeProduct;

  if (!product) {
    // Still fetching (API on, nothing cached yet) — avoid a false "not found" flash.
    if (apiEnabled && !notFound) {
      return <div className="container-app py-24 text-center text-ink-soft">Loading…</div>;
    }
    return (
      <div className="container-app py-24 text-center">
        <Package className="mx-auto h-12 w-12 text-muted/50" />
        <h1 className="mt-4 text-2xl font-bold text-primary">Product not found</h1>
        <p className="mt-2 text-ink-soft">The product you're looking for may have been removed.</p>
        <Link to="/products" className="btn-primary mt-6">Browse all products</Link>
      </div>
    );
  }

  // Keyed remount resets variant/quantity state when navigating between products.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { products, categories, colours, sizes, settings } = useData();
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);

  const category = categories.find((c) => c.id === product.categoryId);
  const sel = useVariantSelection(product, colours, sizes);
  const gallery = galleryImages(product);
  const [activeImg, setActiveImg] = useState(0);

  const related = useMemo(
    () =>
      products
        .filter((p) => p.isActive && p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4),
    [products, product],
  );

  const canAdd = sel.ready && quantity > 0;

  const handleAdd = () => {
    if (!canAdd) {
      toast.error("Please select the required options.");
      return;
    }
    add(product.id, sel.selectedVariant?.id ?? null, quantity);
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <div className="container-app py-8">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/products" className="hover:text-accent">Products</Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/products?category=${category.slug}`} className="hover:text-accent">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-6 lg:mt-6 lg:gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="group card overflow-hidden">
            <ProductImage label={product.imageLabel} seed={product.id} src={gallery[activeImg]} icon={category?.icon} size="lg" aspectRatio="landscape" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-28 ${
                    i === activeImg ? "border-accent" : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <ProductImage label={product.imageLabel} seed={product.id + i} src={src} size="sm" aspectRatio="landscape" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted">
            Images are representative. Contact us for actual product photos.
          </p>
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link to={`/products?category=${category.slug}`} className="text-sm font-semibold text-accent">
              {category.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Code: <span className="font-semibold text-ink-soft">{product.sku}</span></span>
          </div>

          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="my-6 h-px bg-line" />

          <VariantControls sel={sel} quantity={quantity} setQuantity={setQuantity} />

          {sel.selectedVariant && (
            <p className="mt-3 text-xs text-muted">Variant SKU: {sel.selectedVariant.sku}</p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAdd} disabled={!canAdd} className="btn-accent w-full justify-center px-5 py-3 sm:w-auto">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <a
              href={quickEnquiryUrl(product, settings)}
              target="_blank"
              rel="noreferrer"
              className="btn-wa w-full justify-center px-5 py-3 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
            </a>
          </div>

          {/* Specs */}
          {(product.specifications.length > 0 || product.packingInfo) && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Specifications</h2>
              <div className="overflow-hidden rounded-xl border border-line">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((s, i) => (
                      <tr key={s.key} className={i % 2 ? "bg-surface" : ""}>
                        <td className="w-1/3 px-4 py-2.5 font-medium text-ink-soft">{s.key}</td>
                        <td className="px-4 py-2.5 text-ink">{s.value}</td>
                      </tr>
                    ))}
                    {product.packingInfo && (
                      <tr className={product.specifications.length % 2 ? "bg-surface" : ""}>
                        <td className="px-4 py-2.5 font-medium text-ink-soft">Packing</td>
                        <td className="px-4 py-2.5 text-ink">{product.packingInfo}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-primary">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
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
      )}

      {quickAdd && <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />}
    </div>
  );
}
