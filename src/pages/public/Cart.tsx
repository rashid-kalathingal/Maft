import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/stores/useCart";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { productImageSrc } from "@/data/images";
import { StockBadge } from "@/components/ui/StockBadge";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  resolveCart,
  type CustomerDetails,
} from "@/lib/whatsapp";

export function Cart() {
  const { items, updateQty, remove, clear } = useCart();
  const { products, colours, sizes, categories, settings } = useData();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const lines = useMemo(
    () => resolveCart(items, products, colours, sizes),
    [items, products, colours, sizes],
  );

  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);
  const hasUnavailable = lines.some((l) => !l.inStock);

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <ShoppingCart className="mx-auto h-14 w-14 text-muted/40" />
        <h1 className="mt-5 text-2xl font-bold text-primary">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Browse the catalogue and add items to build a WhatsApp enquiry.</p>
        <Link to="/products" className="btn-primary mt-6">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary">Your Cart</h1>
      <p className="mt-1.5 text-ink-soft">
        {lines.length} item{lines.length !== 1 && "s"} · {totalQty} unit{totalQty !== 1 && "s"} total
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((cartItem) => {
            const product = products.find((p) => p.id === cartItem.productId);
            if (!product) return null;
            const variant = cartItem.variantId
              ? product.variants.find((v) => v.id === cartItem.variantId)
              : undefined;
            const line = {
              product,
              sku: variant?.sku ?? product.sku,
              sizeLabel: sizes.find((s) => s.id === variant?.sizeId)?.label,
              colourName: colours.find((c) => c.id === variant?.colourId)?.name,
              inStock: variant ? variant.isActive && variant.stockQuantity > 0 : product.stockQuantity > 0,
            };
            const cat = categories.find((c) => c.id === product.categoryId);
            return (
              <div key={cartItem.id} className="card flex gap-4 p-3.5">
                <Link to={`/products/${line.product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line">
                  <ProductImage label={line.product.imageLabel} seed={line.product.id} src={productImageSrc(line.product.id, line.product.categoryId, 220)} icon={cat?.icon} size="sm" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/products/${line.product.slug}`} className="line-clamp-2 font-bold text-primary hover:text-accent">
                        {line.product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">Code: {line.sku}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-ink-soft">
                        {line.sizeLabel && <span>Size: <b className="font-semibold">{line.sizeLabel}</b></span>}
                        {line.colourName && <span>Colour: <b className="font-semibold">{line.colourName}</b></span>}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(cartItem.id)}
                      className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="inline-flex items-center rounded-lg border border-line">
                      <button onClick={() => updateQty(cartItem.id, cartItem.quantity - 1)} className="grid h-9 w-9 place-items-center text-ink-soft hover:bg-surface" aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={cartItem.quantity}
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          updateQty(cartItem.id, Number.isNaN(n) ? 1 : n);
                        }}
                        className="h-9 w-14 border-x border-line text-center text-sm font-semibold focus:outline-none"
                      />
                      <button onClick={() => updateQty(cartItem.id, cartItem.quantity + 1)} className="grid h-9 w-9 place-items-center text-ink-soft hover:bg-surface" aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {settings.showStock && <StockBadge inStock={line.inStock} />}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <Link to="/products" className="btn-ghost text-sm">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <button onClick={() => setConfirmClear(true)} className="btn-ghost text-sm text-danger hover:bg-danger/10">
              <Trash2 className="h-4 w-4" /> Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card sticky top-20 p-5">
            <h2 className="text-lg font-bold text-primary">Enquiry Summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Unique items</dt>
                <dd className="font-semibold text-primary">{lines.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Total units</dt>
                <dd className="font-semibold text-primary">{totalQty}</dd>
              </div>
            </dl>

            <div className="my-4 rounded-lg bg-surface px-3 py-2.5 text-xs leading-relaxed text-muted">
              Prices are confirmed over WhatsApp. Sending your cart opens WhatsApp with a prepared
              message — you review and send it yourself. No payment is taken here.
            </div>

            {hasUnavailable && (
              <p className="mb-3 rounded-lg bg-danger/5 px-3 py-2 text-xs text-danger">
                Some items are out of stock. You can still send the enquiry, but please confirm availability.
              </p>
            )}

            <button onClick={() => setCheckoutOpen(true)} className="btn-wa w-full py-3">
              <MessageCircle className="h-4 w-4" /> Send Order via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSubmit={(customer) => {
            const msg = buildWhatsAppMessage(lines, customer, settings);
            const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
            const win = window.open(url, "_blank", "noopener,noreferrer");
            if (!win) {
              toast.error("Couldn't open WhatsApp. Please allow pop-ups and retry.");
              return false;
            }
            toast.success("WhatsApp opened with your enquiry. Review and send the message.");
            setCheckoutOpen(false);
            return true;
          }}
        />
      )}

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear cart?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setConfirmClear(false)} className="btn-outline">Cancel</button>
            <button
              onClick={() => { clear(); setConfirmClear(false); toast.info("Cart cleared."); }}
              className="btn-danger"
            >
              Clear Cart
            </button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">This removes all {lines.length} items from your cart. This can't be undone.</p>
      </Modal>
    </div>
  );
}

function CheckoutModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (c: CustomerDetails) => boolean;
}) {
  const [form, setForm] = useState<CustomerDetails>({ name: "", mobile: "", location: "", notes: "" });
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[\d+\s-]{7,}$/.test(form.mobile.trim())) next.mobile = "Please enter a valid mobile number.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit(form);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Send Enquiry via WhatsApp"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={submit} className="btn-wa">
            <MessageCircle className="h-4 w-4" /> Open WhatsApp
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-ink-soft">
        Enter your details. We'll prepare a WhatsApp message with your cart — you'll review and send it.
      </p>
      <div className="space-y-4">
        <div>
          <label className="label">Name <span className="text-danger">*</span></label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label className="label">Mobile Number <span className="text-danger">*</span></label>
          <input className="input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="e.g. 98765 43210" inputMode="tel" />
          {errors.mobile && <p className="mt-1 text-xs text-danger">{errors.mobile}</p>}
        </div>
        <div>
          <label className="label">Location / City <span className="text-muted">(optional)</span></label>
          <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Manjeri" />
        </div>
        <div>
          <label className="label">Additional Notes <span className="text-muted">(optional)</span></label>
          <textarea className="input min-h-20 resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any specific requirement…" />
        </div>
      </div>
    </Modal>
  );
}
