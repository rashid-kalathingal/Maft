import type { Colour, Product, Size } from "@/types";

export function productInStock(p: Product): boolean {
  if (p.variants.length === 0) return p.stockQuantity > 0;
  return p.variants.some((v) => v.isActive && v.stockQuantity > 0);
}

export function productTotalStock(p: Product): number {
  if (p.variants.length === 0) return p.stockQuantity;
  return p.variants.reduce((sum, v) => sum + (v.isActive ? v.stockQuantity : 0), 0);
}

export function productColourIds(p: Product): string[] {
  return [...new Set(p.variants.map((v) => v.colourId).filter(Boolean) as string[])];
}

export function productSizeIds(p: Product): string[] {
  return [...new Set(p.variants.map((v) => v.sizeId).filter(Boolean) as string[])];
}

export function productColours(p: Product, colours: Colour[]): Colour[] {
  const ids = new Set(productColourIds(p));
  return colours.filter((c) => ids.has(c.id));
}

export function productSizes(p: Product, sizes: Size[]): Size[] {
  const ids = new Set(productSizeIds(p));
  return sizes.filter((s) => ids.has(s.id)).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Does this product force the customer to choose a variant before adding to cart? */
export function requiresSelection(p: Product): boolean {
  return p.hasVariants && p.variants.length > 1;
}
