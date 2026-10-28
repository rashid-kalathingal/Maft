import { useMemo, useState } from "react";
import type { Colour, Product, ProductVariant, Size } from "@/types";
import { productColourIds, productSizeIds } from "@/lib/catalogue";

export interface VariantSelection {
  colourId?: string;
  sizeId?: string;
  setColour: (id?: string) => void;
  setSize: (id?: string) => void;
  availableColours: Colour[];
  availableSizes: Size[];
  colourEnabled: (id: string) => boolean;
  sizeEnabled: (id: string) => boolean;
  needsColour: boolean;
  needsSize: boolean;
  selectedVariant: ProductVariant | null;
  /** True when the product has selectable variants and the required ones are chosen. */
  ready: boolean;
  maxQty: number;
}

/** Find the variant matching current colour/size selection. */
function matchVariant(
  p: Product,
  colourId?: string,
  sizeId?: string,
): ProductVariant | null {
  const hasColour = productColourIds(p).length > 0;
  const hasSize = productSizeIds(p).length > 0;
  return (
    p.variants.find(
      (v) =>
        v.isActive &&
        (!hasColour || v.colourId === colourId) &&
        (!hasSize || v.sizeId === sizeId),
    ) ?? null
  );
}

export function useVariantSelection(
  product: Product,
  colours: Colour[],
  sizes: Size[],
): VariantSelection {
  const colourIds = productColourIds(product);
  const sizeIds = productSizeIds(product);
  const needsColour = colourIds.length > 0;
  const needsSize = sizeIds.length > 0;

  const availableColours = useMemo(
    () => colours.filter((c) => colourIds.includes(c.id)),
    [colours, colourIds],
  );
  const availableSizes = useMemo(
    () => sizes.filter((s) => sizeIds.includes(s.id)).sort((a, b) => a.sortOrder - b.sortOrder),
    [sizes, sizeIds],
  );

  // Preselect when there is only one option (or none to choose).
  const [colourId, setColour] = useState<string | undefined>(
    colourIds.length === 1 ? colourIds[0] : undefined,
  );
  const [sizeId, setSize] = useState<string | undefined>(
    sizeIds.length === 1 ? sizeIds[0] : undefined,
  );

  // A colour/size is enabled if at least one active variant exists with it,
  // honouring the complementary current selection. (Stock is not tracked.)
  const colourEnabled = (id: string) =>
    product.variants.some(
      (v) =>
        v.isActive &&
        v.colourId === id &&
        (!needsSize || !sizeId || v.sizeId === sizeId),
    );
  const sizeEnabled = (id: string) =>
    product.variants.some(
      (v) =>
        v.isActive &&
        v.sizeId === id &&
        (!needsColour || !colourId || v.colourId === colourId),
    );

  const selectedVariant = matchVariant(product, colourId, sizeId);
  const ready =
    (!needsColour || !!colourId) && (!needsSize || !!sizeId) && !!selectedVariant;

  // No stock limit — quantity is only bounded by the UI minimum of 1.
  const maxQty = 9999;

  return {
    colourId,
    sizeId,
    setColour,
    setSize,
    availableColours,
    availableSizes,
    colourEnabled,
    sizeEnabled,
    needsColour,
    needsSize,
    selectedVariant,
    ready,
    maxQty,
  };
}
