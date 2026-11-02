import { create } from "zustand";
import type { CartItem } from "@/types";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import { uid } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  add: (productId: string, variantId: string | null, quantity: number) => void;
  updateQty: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalQuantity: () => number;
}

function persist(items: CartItem[]) {
  saveJSON(STORAGE_KEYS.cart, items);
}

export const useCart = create<CartState>((set, get) => ({
  items: loadJSON<CartItem[]>(STORAGE_KEYS.cart, []),

  add: (productId, variantId, quantity) =>
    set((state) => {
      // Merge same product + same variant; different variants stay separate.
      const existing = state.items.find(
        (i) => i.productId === productId && i.variantId === variantId,
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      } else {
        items = [...state.items, { id: uid("cart"), productId, variantId, quantity }];
      }
      persist(items);
      return { items };
    }),

  updateQty: (id, quantity) =>
    set((state) => {
      const items = state.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0);
      persist(items);
      return { items };
    }),

  remove: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      persist(items);
      return { items };
    }),

  clear: () => {
    persist([]);
    set({ items: [] });
  },

  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
