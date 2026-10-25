import { create } from "zustand";
import type {
  Category,
  Colour,
  Product,
  Settings,
  Size,
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

interface DataState {
  products: Product[];
  categories: Category[];
  colours: Colour[];
  sizes: Size[];
  settings: Settings;

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

  resetDemoData: () => void;
}

function seedAll() {
  return {
    products: buildSeedProducts(),
    categories: seedCategories,
    colours: seedColours,
    sizes: buildSeedSizes(),
    settings: seedSettings,
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
  };
}

export const useData = create<DataState>((set, get) => ({
  ...loadAll(),

  saveProduct: (p) =>
    set((state) => {
      const exists = state.products.some((x) => x.id === p.id);
      const products = exists
        ? state.products.map((x) => (x.id === p.id ? p : x))
        : [p, ...state.products];
      saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  deleteProduct: (id) =>
    set((state) => {
      const products = state.products.filter((p) => p.id !== id);
      saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  deleteProducts: (ids) =>
    set((state) => {
      const idset = new Set(ids);
      const products = state.products.filter((p) => !idset.has(p.id));
      saveJSON(STORAGE_KEYS.products, products);
      return { products };
    }),

  setProductsActive: (ids, active) =>
    set((state) => {
      const idset = new Set(ids);
      const products = state.products.map((p) =>
        idset.has(p.id) ? { ...p, isActive: active, updatedAt: new Date().toISOString() } : p,
      );
      saveJSON(STORAGE_KEYS.products, products);
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
      saveJSON(STORAGE_KEYS.products, products);
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
      saveJSON(STORAGE_KEYS.categories, categories);
      return { categories };
    }),

  deleteCategory: (id) => {
    const inUse = get().products.some((p) => p.categoryId === id);
    if (inUse) return false;
    set((state) => {
      const categories = state.categories.filter((c) => c.id !== id);
      saveJSON(STORAGE_KEYS.categories, categories);
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
      saveJSON(STORAGE_KEYS.colours, colours);
      return { colours };
    }),

  deleteColour: (id) => {
    const inUse = get().products.some((p) => p.variants.some((v) => v.colourId === id));
    if (inUse) return false;
    set((state) => {
      const colours = state.colours.filter((c) => c.id !== id);
      saveJSON(STORAGE_KEYS.colours, colours);
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
      saveJSON(STORAGE_KEYS.sizes, sizes);
      return { sizes };
    }),

  deleteSize: (id) => {
    const inUse = get().products.some((p) => p.variants.some((v) => v.sizeId === id));
    if (inUse) return false;
    set((state) => {
      const sizes = state.sizes.filter((s) => s.id !== id);
      saveJSON(STORAGE_KEYS.sizes, sizes);
      return { sizes };
    });
    return true;
  },

  saveSettings: (s) =>
    set(() => {
      saveJSON(STORAGE_KEYS.settings, s);
      return { settings: s };
    }),

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
