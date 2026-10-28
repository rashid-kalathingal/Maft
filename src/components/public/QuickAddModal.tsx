import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { primaryImage } from "@/data/images";
import { VariantControls } from "./VariantControls";
import { useVariantSelection } from "@/lib/useVariantSelection";
import { useData } from "@/stores/useData";
import { useCart } from "@/stores/useCart";
import { toast } from "@/stores/useToast";

export function QuickAddModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { colours, sizes, categories } = useData();
  const add = useCart((s) => s.add);
  const category = categories.find((c) => c.id === product.categoryId);
  const sel = useVariantSelection(product, colours, sizes);
  const [quantity, setQuantity] = useState(1);

  const canAdd = sel.ready && quantity > 0;

  const handleAdd = () => {
    if (!canAdd) {
      toast.error("Please select the required options.");
      return;
    }
    add(product.id, sel.selectedVariant?.id ?? null, quantity);
    toast.success(`${product.name} added to cart.`);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add to Cart"
      footer={
        <div className="flex items-center gap-3">
          <Link to={`/products/${product.slug}`} className="btn-ghost text-sm" onClick={onClose}>
            View full details
          </Link>
          <button onClick={handleAdd} disabled={!canAdd} className="btn-accent ml-auto">
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line">
          <ProductImage label={product.imageLabel} seed={product.id} src={primaryImage(product, 220)} icon={category?.icon} size="sm" />
        </div>
        <div>
          <h3 className="font-bold text-primary">{product.name}</h3>
          <p className="text-xs text-muted">Code: {product.sku}</p>
          <p className="mt-1 text-sm text-ink-soft">{product.shortDescription}</p>
        </div>
      </div>

      <div className="mt-5">
        <VariantControls sel={sel} quantity={quantity} setQuantity={setQuantity} />
      </div>
    </Modal>
  );
}
