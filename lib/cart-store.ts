import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getShippingPrice } from "@/lib/pricing";

export type Product = {
  id: string; name: string; price: number;
  description: string | null; image_url: string | null;
};
export type CartItem = Product & { qty: number };
export type DeliveryMode = "relay" | "home";

type CartState = {
  items: CartItem[];
  open: boolean;
  deliveryCity: string;
  deliveryMode: DeliveryMode;
  customerName: string;
  customerPhone: string;
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggle: (open?: boolean) => void;
  setDelivery: (city: string, mode: DeliveryMode) => void;
  setCustomer: (name: string, phone: string) => void;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      deliveryCity: "",
      deliveryMode: "relay",
      customerName: "",
      customerPhone: "",
      add: (p) =>
        set((s) => {
          const found = s.items.find((i) => i.id === p.id);
          return {
            open: true,
            items: found
              ? s.items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
              : [...s.items, { ...p, qty: 1 }],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [], deliveryCity: "", deliveryMode: "relay", customerName: "", customerPhone: "" }),
      toggle: (open) => set((s) => ({ open: open ?? !s.open })),
      setDelivery: (city, mode) => set({ deliveryCity: city, deliveryMode: mode }),
      setCustomer: (name, phone) => set({ customerName: name, customerPhone: phone }),
      subtotal: () => get().items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0),
      shipping: () => getShippingPrice(get().deliveryCity, get().deliveryMode),
      total: () => get().subtotal() + get().shipping(),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    {
      name: "lovely-vault-cart",
      partialize: (s) => ({
        items: s.items,
        deliveryCity: s.deliveryCity,
        deliveryMode: s.deliveryMode,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
      }),
    }
  )
);
