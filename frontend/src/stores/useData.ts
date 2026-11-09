import { create } from "zustand";
import type {
  Category,
  Colour,
  Product,
  Settings,
  Size,
  Inquiry,
} from "@/types";
import {
  buildSeedProducts,
  buildSeedSizes,
  seedCategories,
  seedColours,
  seedSettings,
} from "@/data/seed";
import {
  DATA_VERSION,
  loadJSON,
  saveJSON,
  STORAGE_KEYS,
} from "@/lib/storage";
import { api, apiEnabled, cardToProduct, getToken } from "@/services/api";
import { toast } from "@/stores/useToast";

/** Fire an API write in the background; surface failures without blocking the UI. */
function fire(p: Promise<unknown>) {
  p.catch((e: unknown) => toast.error(e instanceof Error ? e.message : "Could not sync with server."));
}

interface DataState {
  products: Product[];
  categories: Category[];
  colours: Colour[];
  sizes: Size[];
  settings: Settings;
  inquiries: Inquiry[];

  /** True while the first API hydrate is in flight (drives splash + skeletons). */
  loading: boolean;
  /** True once the first hydrate attempt has completed (success or fail). */
  hydrated: boolean;

  // products
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  setProductsActive: (ids: string[], active: boolean) => void;
  duplicateProduct: (id: string) => Product | undefined;

  // categories
  saveCategory: (c: Category) => void;
  deleteCategory: (id: string) => boolean;

  // colours
  saveColour: (c: Colour) => void;
  deleteColour: (id: string) => boolean;

  // sizes
  saveSize: (s: Size) => void;
  deleteSize: (id: string) => boolean;

  // settings
  saveSettings: (s: Settings) => void;

  // inquiries
  saveInquiry: (i: Inquiry) => void;
  deleteInquiry: (id: string) => void;

  resetDemoData: () => void;

  /** Load catalogue + settings from the backend (no-op unless VITE_API_URL is set). */
  hydrateFromApi: () => Promise<void>;
}

function seedAll() {
  return {
    products: buildSeedProducts(),
    categories: seedCategories,
    colours: seedColours,
    sizes: buildSeedSizes(),
    settings: seedSettings,
    inquiries: [],
  };
}

function loadAll() {
  const version = loadJSON<string>(STORAGE_KEYS.version, "");
  if (version !== DATA_VERSION) {
    const seeded = seedAll();
    saveJSON(STORAGE_KEYS.products, seeded.products);
    saveJSON(STORAGE_KEYS.categories, seeded.categories);
    saveJSON(STORAGE_KEYS.colours, seeded.colours);
    saveJSON(STORAGE_KEYS.sizes, seeded.sizes);
    saveJSON(STORAGE_KEYS.settings, seeded.settings);
    saveJSON(STORAGE_KEYS.version, DATA_VERSION);
    return seeded;
  }
  const defaults = seedAll();
  return {
    products: loadJSON<Product[]>(STORAGE_KEYS.products, defaults.products),
    categories: loadJSON<Category[]>(STORAGE_KEYS.categories, defaults.categories),
    colours: loadJSON<Colour[]>(STORAGE_KEYS.colours, defaults.colours),
    sizes: loadJSON<Size[]>(STORAGE_KEYS.sizes, defaults.sizes),
    settings: loadJSON<Settings>(STORAGE_KEYS.settings, defaults.settings),
    inquiries: loadJSON<Inquiry[]>(STORAGE_KEYS.inquiries, defaults.inquiries),
  };
}

export const useData = create<DataState>((set, get) => ({
  ...loadAll(),
  // When a backend is configured we start in a loading state until the first
  // hydrate resolves; in localStorage-only mode data is ready immediately.
  loading: apiEnabled,
  hydrated: !apiEnabled,

  saveProduct: (p) =>
    set((state) => {
      const exists = state.products.some((x) => x.id === p.id);
      const products = exists
        ? state.products.map((x) => (x.id === p.id ? p : x))
        : [p, ...state.products];
      if (apiEnabled) fire(exists ? api.updateProduct(p) : api.createProduct(p));
      else saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  deleteProduct: (id) =>
    set((state) => {
      const products = state.products.filter((p) => p.id !== id);
      if (apiEnabled) fire(api.deleteProduct(id));
      else saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  deleteProducts: (ids) =>
    set((state) => {
      const idset = new Set(ids);
      const products = state.products.filter((p) => !idset.has(p.id));
      if (apiEnabled) ids.forEach((id) => fire(api.deleteProduct(id)));
      else saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  setProductsActive: (ids, active) =>
    set((state) => {
      const idset = new Set(ids);
      const products = state.products.map((p) =>
        idset.has(p.id) ? { ...p, isActive: active, updatedAt: new Date().toISOString() } : p,
      );
      if (apiEnabled) products.filter((p) => idset.has(p.id)).forEach((p) => fire(api.updateProduct(p)));
      else saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  duplicateProduct: (id) => {
    const src = get().products.find((p) => p.id === id);
    if (!src) return undefined;
    const now = new Date().toISOString();
    const newId = `MAFT-${Date.now().toString().slice(-6)}`;
    const copy: Product = {
      ...src,
      id: newId,
      sku: newId,
      name: `${src.name} (Copy)`,
      slug: `${src.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      variants: src.variants.map((v, i) => ({
        ...v,
        id: `${newId}-v${i + 1}`,
        productId: newId,
        sku: v.sku.replace(src.sku, newId),
      })),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => {
      const products = [copy, ...state.products];
      if (apiEnabled) fire(api.createProduct(copy));
      else saveJSON(STORAGE_KEYS.products, products);
      return { products };
    });
    return copy;
  },

  saveCategory: (c) =>
    set((state) => {
      const exists = state.categories.some((x) => x.id === c.id);
      const categories = exists
        ? state.categories.map((x) => (x.id === c.id ? c : x))
        : [...state.categories, c];
      if (apiEnabled) fire(exists ? api.updateCategory(c) : api.createCategory(c));
      else saveJSON(STORAGE_KEYS.categories, categories);
      return { categories };
    }),

  deleteCategory: (id) => {
    const inUse = get().products.some((p) => p.categoryId === id);
    if (inUse) return false;
    set((state) => {
      const categories = state.categories.filter((c) => c.id !== id);
      if (apiEnabled) fire(api.deleteCategory(id));
      else saveJSON(STORAGE_KEYS.categories, categories);
      return { categories };
    });
    return true;
  },

  saveColour: (c) =>
    set((state) => {
      const exists = state.colours.some((x) => x.id === c.id);
      const colours = exists
        ? state.colours.map((x) => (x.id === c.id ? c : x))
        : [...state.colours, c];
      if (apiEnabled) fire(exists ? api.updateColour(c) : api.createColour(c));
      else saveJSON(STORAGE_KEYS.colours, colours);
      return { colours };
    }),

  deleteColour: (id) => {
    const inUse = get().products.some((p) => p.variants.some((v) => v.colourId === id));
    if (inUse) return false;
    set((state) => {
      const colours = state.colours.filter((c) => c.id !== id);
      if (apiEnabled) fire(api.deleteColour(id));
      else saveJSON(STORAGE_KEYS.colours, colours);
      return { colours };
    });
    return true;
  },

  saveSize: (s) =>
    set((state) => {
      const exists = state.sizes.some((x) => x.id === s.id);
      const sizes = (exists
        ? state.sizes.map((x) => (x.id === s.id ? s : x))
        : [...state.sizes, s]
      ).sort((a, b) => a.sortOrder - b.sortOrder);
      if (apiEnabled) fire(exists ? api.updateSize(s) : api.createSize(s));
      else saveJSON(STORAGE_KEYS.sizes, sizes);
      return { sizes };
    }),

  deleteSize: (id) => {
    const inUse = get().products.some((p) => p.variants.some((v) => v.sizeId === id));
    if (inUse) return false;
    set((state) => {
      const sizes = state.sizes.filter((s) => s.id !== id);
      if (apiEnabled) fire(api.deleteSize(id));
      else saveJSON(STORAGE_KEYS.sizes, sizes);
      return { sizes };
    });
    return true;
  },

  saveSettings: (s) =>
    set(() => {
      if (apiEnabled) fire(api.updateSettings(s));
      else saveJSON(STORAGE_KEYS.settings, s);
      return { settings: s };
    }),

  saveInquiry: (i) =>
    set((state) => {
      const exists = state.inquiries.some((x) => x.id === i.id);
      const inquiries = exists
        ? state.inquiries.map((x) => (x.id === i.id ? i : x))
        : [i, ...state.inquiries];
      if (apiEnabled) fire(exists ? api.updateInquiry(i) : api.createInquiry(i));
      else saveJSON(STORAGE_KEYS.inquiries, inquiries);
      return { inquiries };
    }),

  deleteInquiry: (id) =>
    set((state) => {
      const inquiries = state.inquiries.filter((i) => i.id !== id);
      if (apiEnabled) fire(api.deleteInquiry(id));
      else saveJSON(STORAGE_KEYS.inquiries, inquiries);
      return { inquiries };
    }),

  hydrateFromApi: async () => {
    if (!apiEnabled) {
      set({ loading: false, hydrated: true });
      return;
    }
    set({ loading: true });
    try {
      // Public catalogue data — available without authentication.
      const [cards, categories, colours, sizes, settings] = await Promise.all([
        api.getProductList(),
        api.getCategories(),
        api.getColours(),
        api.getSizes(),
        api.getSettings(),
      ]);
      set({ products: cards.map(cardToProduct), categories, colours, sizes, settings });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load data from server.");
    } finally {
      set({ loading: false, hydrated: true });
    }
    // Inquiries are admin-only (GET requires auth); load them separately so a
    // 401/403 on the public site never blocks the catalogue above.
    if (getToken()) {
      try {
        set({ inquiries: await api.getInquiries() });
      } catch {
        /* not fatal for the public site */
      }
    }
  },

  resetDemoData: () => {
    const seeded = seedAll();
    saveJSON(STORAGE_KEYS.products, seeded.products);
    saveJSON(STORAGE_KEYS.categories, seeded.categories);
    saveJSON(STORAGE_KEYS.colours, seeded.colours);
    saveJSON(STORAGE_KEYS.sizes, seeded.sizes);
    saveJSON(STORAGE_KEYS.settings, seeded.settings);
    saveJSON(STORAGE_KEYS.version, DATA_VERSION);
    set(seeded);
  },
}));

/* Derived helpers (not hooks) */
export function colourMap(colours: Colour[]): Record<string, Colour> {
  return Object.fromEntries(colours.map((c) => [c.id, c]));
}
export function sizeMap(sizes: Size[]): Record<string, Size> {
  return Object.fromEntries(sizes.map((s) => [s.id, s]));
}
