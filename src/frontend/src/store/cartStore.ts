import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  size: bigint;
  price: bigint;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: bigint) => void;
  updateQuantity: (productId: string, size: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => bigint;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        }));
      },
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * BigInt(i.quantity), 0n),
    }),
    {
      name: "rawaha-cart",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          // Rehydrate BigInt fields
          if (data?.state?.items) {
            data.state.items = data.state.items.map(
              (item: CartItem & { size: string; price: string }) => ({
                ...item,
                size: BigInt(item.size),
                price: BigInt(item.price),
              }),
            );
          }
          return data;
        },
        setItem: (name, value) => {
          const data = JSON.parse(
            JSON.stringify(value, (_, v) =>
              typeof v === "bigint" ? v.toString() : v,
            ),
          );
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
