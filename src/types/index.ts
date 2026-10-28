export interface ProductImage {
  id: string;
  /** For the demo we use emoji/initials placeholders instead of real photos. */
  label: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  sizeId?: string;
  colourId?: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  /** Placeholder label shown in the product tile (initials). */
  imageLabel: string;
  hasVariants: boolean;
  variants: ProductVariant[];
  /** Up to 4 uploaded product photos (data URLs in the demo; backend URLs later). */
  imageUrls?: string[];
  specifications: ProductSpecification[];
  packingInfo?: string;
  /** Single stock figure used only when hasVariants === false. */
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Colour {
  id: string;
  name: string;
  hexCode?: string;
  secondaryHexCode?: string;
  isActive: boolean;
}

export type SizeUnit = "inch" | "mm" | "cm" | "m" | "custom";

export interface Size {
  id: string;
  label: string;
  value?: number;
  unit: SizeUnit;
  sortOrder: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
}

export interface Settings {
  businessName: string;
  tagline: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  showStock: boolean;
  productsPerPage: number;
  /** Optional uploaded brand logo (data URL) that overrides the bundled logo. */
  logoUrl?: string;
}
