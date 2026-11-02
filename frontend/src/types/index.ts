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
  /** Optional price (INR). Undefined means "enquire for price". */
  price?: number;
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
  /** AVAILABLE | NOT_AVAILABLE | STOCK_CLEARING */
  availability?: Availability;
  /** Optional quality grade shown as a badge. */
  qualityGrade?: QualityGrade;
  /** Item carries the "Replacement Guarantee" note. */
  replacementGuarantee?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Availability = "AVAILABLE" | "NOT_AVAILABLE" | "STOCK_CLEARING";
export type QualityGrade = "NORMAL" | "HEAVY" | "HIGH" | "PREMIUM";

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
  /** Optional uploaded category image (Supabase). Falls back to the mapped/default image when empty. */
  imageUrl?: string;
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
  /** Optional uploaded brand logo (URL) that overrides the bundled logo. */
  logoUrl?: string;
  /** Optional uploaded favicon (URL) that overrides the bundled favicon. */
  faviconUrl?: string;
  /** ISO timestamp of the last favicon change (enforces the 45-day limit). */
  faviconUpdatedAt?: string;
  /** Previously used brand logos, so one can be re-selected. */
  logoHistory?: string[];
}

export type InquiryStatus = "PENDING" | "RESPONDED" | "COMPLETED" | "CANCELLED";

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress?: string;
  cartItems: string; // JSON string of cart items
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
