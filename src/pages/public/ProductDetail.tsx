import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, MessageCircle, ChevronRight, Package } from "lucide-react";
import { useData } from "@/stores/useData";
import { useCart } from "@/stores/useCart";
import { toast } from "@/stores/useToast";
import { ProductImage } from "@/components/ui/ProductImage";
import { VariantControls } from "@/components/public/VariantControls";
import { ProductCard } from "@/components/public/ProductCard";
import { QuickAddModal } from "@/components/public/QuickAddModal";
import { useVariantSelection } from "@/lib/useVariantSelection";
import { productGallery } from "@/data/images";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import type { Product } from "@/types";

export function ProductDetail() {
  const { slug } = useParams();
  const product = useData((s) => s.products.find((p) => p.slug === slug && p.isActive));

  if (!product) {
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
  const gallery = productGallery(product.id, product.categoryId);
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

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="group card overflow-hidden">
            <ProductImage label={product.imageLabel} seed={product.id} src={gallery[activeImg]} icon={category?.icon} size="lg" />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                  i === activeImg ? "border-accent" : "border-line opacity-70 hover:opacity-100"
                }`}
              >
                <ProductImage label={product.imageLabel} seed={product.id + i} src={src} size="sm" />
              </button>
            ))}
          </div>
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
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-primary">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Code: <span className="font-semibold text-ink-soft">{product.sku}</span></span>
          </div>

          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="my-6 h-px bg-line" />

          <VariantControls sel={sel} quantity={quantity} setQuantity={setQuantity} />

          {sel.selectedVariant && (
            <p className="mt-3 text-xs text-muted">Variant SKU: {sel.selectedVariant.sku}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleAdd} disabled={!canAdd} className="btn-accent flex-1 px-5 py-3 sm:flex-none">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <a
              href={quickEnquiryUrl(product, settings)}
              target="_blank"
              rel="noreferrer"
              className="btn-wa flex-1 px-5 py-3 sm:flex-none"
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
