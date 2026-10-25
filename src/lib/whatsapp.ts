import type { CartItem, Colour, Product, Settings, Size } from "@/types";

export interface CustomerDetails {
  name: string;
  mobile: string;
  location?: string;
  notes?: string;
}

export interface ResolvedLine {
  product: Product;
  sizeLabel?: string;
  colourName?: string;
  sku: string;
  quantity: number;
  inStock: boolean;
}

/** Resolve cart items against the current catalogue (prices are intentionally omitted). */
export function resolveCart(
  items: CartItem[],
  products: Product[],
  colours: Colour[],
  sizes: Size[],
): ResolvedLine[] {
  const lines: ResolvedLine[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isActive) continue;

    let sizeLabel: string | undefined;
    let colourName: string | undefined;
    let sku = product.sku;
    let inStock = product.stockQuantity > 0;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (variant) {
        sku = variant.sku;
        inStock = variant.isActive && variant.stockQuantity > 0;
        sizeLabel = sizes.find((s) => s.id === variant.sizeId)?.label;
        colourName = colours.find((c) => c.id === variant.colourId)?.name;
      }
    }

    lines.push({ product, sizeLabel, colourName, sku, quantity: item.quantity, inStock });
  }
  return lines;
}

/** Build the WhatsApp enquiry message text (not URL-encoded). */
export function buildWhatsAppMessage(
  lines: ResolvedLine[],
  customer: CustomerDetails,
  settings: Settings,
): string {
  const parts: string[] = [];
  parts.push(`Hello ${settings.businessName},`);
  parts.push("");
  parts.push("I would like to enquire about the following products:");
  parts.push("");

  lines.forEach((line, i) => {
    parts.push(`*${i + 1}. ${line.product.name}*`);
    parts.push(`Code: ${line.sku}`);
    if (line.sizeLabel) parts.push(`Size: ${line.sizeLabel}`);
    if (line.colourName) parts.push(`Colour: ${line.colourName}`);
    parts.push(`Quantity: ${line.quantity}`);
    parts.push("");
  });

  parts.push("--------------------");
  parts.push("");
  parts.push("*Customer Details*");
  parts.push("");
  parts.push(`Name: ${customer.name}`);
  parts.push(`Mobile: ${customer.mobile}`);
  if (customer.location?.trim()) parts.push(`Location: ${customer.location.trim()}`);
  if (customer.notes?.trim()) {
    parts.push("");
    parts.push("Additional Notes:");
    parts.push(customer.notes.trim());
  }
  parts.push("");
  parts.push("Thank you.");

  return parts.join("\n");
}

/** Build the wa.me click-to-chat URL for a single-product quick enquiry or the full cart. */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function quickEnquiryUrl(product: Product, settings: Settings): string {
  const msg = `Hello ${settings.businessName}, I'm interested in *${product.name}* (Code: ${product.sku}). Please share availability and price.`;
  return buildWhatsAppUrl(settings.whatsappNumber, msg);
}
