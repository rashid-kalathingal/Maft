import type { Category, Colour, Product, Settings, Size, Inquiry } from "@/types";

/**
 * REST client for the Spring Boot backend. Enabled only when VITE_API_URL is set
 * (e.g. in .env or on Vercel). When it is NOT set, the app stays on localStorage,
 * so the current deployment keeps working unchanged.
 */
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";
export const apiEnabled = BASE.length > 0;

/** Slim product projection returned by GET /api/products/list. */
export interface ProductCardDto {
  id: string; name: string; slug: string; sku: string; categoryId: string;
  shortDescription: string; price: number | null; imageLabel: string;
  thumbnailUrl: string | null; hasVariants: boolean; stockQuantity: number;
  isActive: boolean; isFeatured: boolean; isNewArrival: boolean; sortOrder: number;
  availability: string; qualityGrade: string | null; replacementGuarantee: boolean;
  createdAt: string; updatedAt: string;
}

/**
 * Expand a slim card into a full Product shape for the store. Nested data the
 * card omits (variants, specifications, full image list) is left empty; the
 * detail page and admin edit form re-fetch the full product by id when needed.
 */
export function cardToProduct(c: ProductCardDto): Product {
  return {
    id: c.id, name: c.name, slug: c.slug, sku: c.sku, categoryId: c.categoryId,
    shortDescription: c.shortDescription ?? "", description: "",
    imageLabel: c.imageLabel ?? "", imageUrls: c.thumbnailUrl ? [c.thumbnailUrl] : [],
    hasVariants: c.hasVariants, variants: [], specifications: [],
    price: c.price ?? undefined, packingInfo: "", stockQuantity: c.stockQuantity ?? 0,
    isActive: c.isActive, isFeatured: c.isFeatured, isNewArrival: c.isNewArrival,
    sortOrder: c.sortOrder ?? 0, availability: c.availability as Product["availability"],
    qualityGrade: (c.qualityGrade ?? undefined) as Product["qualityGrade"],
    replacementGuarantee: c.replacementGuarantee,
    createdAt: c.createdAt ?? "", updatedAt: c.updatedAt ?? "",
  } as Product;
}

const TOKEN_KEY = "maft.token";

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore */ }
}

/** Turn a stored image path ("/uploads/x.jpg") into an absolute URL on the API host. */
export function resolveAsset(url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.startsWith("/uploads/")) return `${BASE}${url}`;
  return url;
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch { /* ignore */ }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  // auth
  login: (email: string, password: string) =>
    req<{ token: string; email: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // reads
  getProducts: () => req<Product[]>("/api/products"),
  /** Lightweight card projection for lists/grids (fast; no variants/specs). */
  getProductList: () => req<ProductCardDto[]>("/api/products/list"),
  /** Full product by id or slug (used by detail page + admin edit). */
  getProduct: (idOrSlug: string) => req<Product>(`/api/products/${idOrSlug}`),
  getCategories: () => req<Category[]>("/api/categories"),
  getColours: () => req<Colour[]>("/api/colours"),
  getSizes: () => req<Size[]>("/api/sizes"),
  getSettings: () => req<Settings>("/api/settings"),

  // products
  createProduct: (p: Product) => req<Product>("/api/products", { method: "POST", body: JSON.stringify(p) }),
  updateProduct: (p: Product) => req<Product>(`/api/products/${p.id}`, { method: "PUT", body: JSON.stringify(p) }),
  deleteProduct: (id: string) => req<void>(`/api/products/${id}`, { method: "DELETE" }),

  // categories
  createCategory: (c: Category) => req<Category>("/api/categories", { method: "POST", body: JSON.stringify(c) }),
  updateCategory: (c: Category) => req<Category>(`/api/categories/${c.id}`, { method: "PUT", body: JSON.stringify(c) }),
  deleteCategory: (id: string) => req<void>(`/api/categories/${id}`, { method: "DELETE" }),

  // colours
  createColour: (c: Colour) => req<Colour>("/api/colours", { method: "POST", body: JSON.stringify(c) }),
  updateColour: (c: Colour) => req<Colour>(`/api/colours/${c.id}`, { method: "PUT", body: JSON.stringify(c) }),
  deleteColour: (id: string) => req<void>(`/api/colours/${id}`, { method: "DELETE" }),

  // sizes
  createSize: (s: Size) => req<Size>("/api/sizes", { method: "POST", body: JSON.stringify(s) }),
  updateSize: (s: Size) => req<Size>(`/api/sizes/${s.id}`, { method: "PUT", body: JSON.stringify(s) }),
  deleteSize: (id: string) => req<void>(`/api/sizes/${id}`, { method: "DELETE" }),

  // settings
  updateSettings: (s: Settings) => req<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(s) }),

  // inquiries
  getInquiries: () => req<Inquiry[]>("/api/inquiries"),
  createInquiry: (i: Inquiry) => req<Inquiry>("/api/inquiries", { method: "POST", body: JSON.stringify(i) }),
  updateInquiry: (i: Inquiry) => req<Inquiry>(`/api/inquiries/${i.id}`, { method: "PUT", body: JSON.stringify(i) }),
  deleteInquiry: (id: string) => req<void>(`/api/inquiries/${id}`, { method: "DELETE" }),

  // uploads -> returns absolute URL
  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const { url } = await req<{ url: string }>("/api/uploads", { method: "POST", body: form });
    // Supabase returns an absolute URL; only local "/uploads/..." paths need the API host.
    return url.startsWith("http") ? url : `${BASE}${url}`;
  },

  // storage usage meter
  getStorageUsage: () =>
    req<{ usedBytes: number; limitBytes: number; freeBytes: number; fileCount: number; percentUsed: number; source: string }>(
      "/api/uploads/usage",
    ),
};
