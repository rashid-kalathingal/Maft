/** Safe localStorage helpers that never throw during SSR, private mode, etc. */

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / disabled storage — ignore for the demo */
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  products: "maft.products",
  categories: "maft.categories",
  colours: "maft.colours",
  sizes: "maft.sizes",
  settings: "maft.settings",
  cart: "maft.cart",
  auth: "maft.auth",
  inquiries: "maft.inquiries",
  version: "maft.version",
} as const;

/** Bump when the seed shape changes to force a reseed. */
export const DATA_VERSION = "1.0.1";
