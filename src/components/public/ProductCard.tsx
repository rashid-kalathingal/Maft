import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import type { Category, Colour, Product, Size } from "@/types";
import { productImageSrc } from "@/data/images";
import {
  productColours,
  productInStock,
  productSizes,
} from "@/lib/catalogue";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  category?: Category;
  colours: Colour[];
  sizes: Size[];
  onQuickAdd: (p: Product) => void;
}

export function ProductCard({ product, category, colours, sizes, onQuickAdd }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const inStock = productInStock(product);
  const pColours = productColours(product, colours);
  const pSizes = productSizes(product, sizes);

  const imgSrc = productImageSrc(product.id, product.categoryId);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#ece8df] bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd8cc] hover:shadow-card">
      {/* Top Image Box with Wishlist */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f8f7f4] flex items-center justify-center p-3">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#736a5f] hover:text-red-500"
            )}
          />
        </button>

        <Link to={`/products/${product.slug}`} className="flex h-full w-full items-center justify-center">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col">
        {/* Title */}
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-1 text-sm font-bold text-[#1c1813] transition-colors hover:text-[#8e5927]"
        >
          {product.name}
        </Link>

        {/* SKU */}
        <p className="mt-0.5 text-xs text-[#8c8479] font-medium tracking-wide">
          {product.sku}
        </p>

        {/* Badges / Tags row */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {category && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#ede7dc] bg-[#faf7f2] px-2 py-0.5 text-[11px] font-medium text-[#8e5927]">
              <span className="text-[10px]">⊙</span>
              <span className="truncate max-w-[110px]">{category.name.split("&")[0].trim()}</span>
            </span>
          )}

          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#d5ebd9] bg-[#f0f7f1] px-2 py-0.5 text-[11px] font-medium text-[#2e7d43]">
              <span className="text-[10px]">⊙</span> Featured
            </span>
          )}

          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#d0e1fd] bg-[#edf4fe] px-2 py-0.5 text-[11px] font-medium text-[#2068b5]">
              <span className="text-[10px]">⊙</span> New Arrival
            </span>
          )}

          {!product.isFeatured && !product.isNewArrival && pSizes.length > 1 && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#e8e4dc] bg-[#f7f6f3] px-2 py-0.5 text-[11px] font-medium text-[#62594e]">
              <span className="text-[10px]">⊙</span> Multiple Sizes
            </span>
          )}
        </div>

        {/* Colour Row */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6e655a]">
          <span className="text-[11px] font-medium">Colour:</span>
          {pColours.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {pColours.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  title={c.name}
                  className="h-3 w-3 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: c.hexCode }}
                />
              ))}
              {pColours.length > 4 && (
                <span className="text-[10px] text-[#999]">+{pColours.length - 4}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#1a1a1a] border border-black/15" />
              <span className="h-3 w-3 rounded-full bg-[#c9a227] border border-black/15" />
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#524a40]">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              inStock ? "bg-[#22c55e]" : "bg-red-500"
            )}
          />
          <span className="text-[11px]">
            Stock: <strong className="font-semibold text-[#1c1813]">{inStock ? "In Stock" : "Out of Stock"}</strong>
          </span>
        </div>

        {/* Bottom Two Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex items-center justify-center rounded-lg border border-[#ded8ce] bg-white py-2 text-xs font-semibold text-[#2c261e] transition-colors hover:bg-[#faf7f2] hover:border-[#8e5927]/40 text-center"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={!inStock}
            onClick={() => onQuickAdd(product)}
            className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-[#8e5927] px-1 py-2 text-xs font-semibold leading-none text-white shadow-sm transition hover:bg-[#78491d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5 hidden sm:inline" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
