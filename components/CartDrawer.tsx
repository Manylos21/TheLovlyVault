"use client";
import { useRef, useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, Copy } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { buildOrderMessage, copyOrderMessage, openInstagramDM } from "@/lib/instagram";
import { formatPrice } from "@/lib/pricing";

export default function CartDrawer() {
  const cartContentRef = useRef<HTMLDivElement>(null);
  const {
    items,
    open,
    toggle,
    setQty,
    remove,
    deliveryCity,
    deliveryMode,
    setDelivery,
    customerName,
    customerPhone,
    setCustomer,
    subtotal,
    shipping,
    total,
  } = useCart();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const canOrder = items.length > 0
    && deliveryCity.trim().length > 0
    && customerName.trim().length > 0
    && customerPhone.trim().length > 0;

  useEffect(() => {
    if (!open || items.length === 0 || !cartContentRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      cartContentRef.current?.scrollTo({
        top: cartContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, items.length]);

  const order = async () => {
    if (!canOrder) return;

    const message = buildOrderMessage(
      items,
      subtotal(),
      shipping(),
      deliveryCity.trim(),
      deliveryMode,
      total(),
      customerName.trim(),
      customerPhone.trim(),
    );
    const copied = await copyOrderMessage(message);
    if (copied) openInstagramDM(message);
    setCopyState(copied ? "copied" : "failed");
  };

  return (
    <>
      <div onClick={() => toggle(false)}
        className={`fixed inset-0 z-40 bg-lilac-900/40 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />

      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-lilac-100 p-4">
          <h2 className="font-display text-2xl text-lilac-700">My cart 🛍️</h2>
          <button onClick={() => toggle(false)} aria-label="Close"
            className="rounded-full p-2 hover:bg-lilac-100"><X size={22} /></button>
        </div>

        <div ref={cartContentRef} className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {items.length === 0 && (
              <p className="py-16 text-center text-lilac-500">Your cart is empty 💜</p>
            )}
            {items.map((i) => (
              <div key={i.id} className="flex gap-3 rounded-2xl bg-lilac-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {i.image_url && <img src={i.image_url} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium leading-tight">{i.name}</p>
                    <button onClick={() => remove(i.id)} aria-label="Remove item"
                      className="text-lilac-400 hover:text-lilac-700"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full bg-white px-1 py-0.5">
                      <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease quantity" className="p-1 text-lilac-600"><Minus size={14} /></button>
                      <span className="w-5 text-center text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase quantity" className="p-1 text-lilac-600"><Plus size={14} /></button>
                    </div>
                    <span className="font-semibold text-lilac-700">{formatPrice(Number(i.price) * i.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="mt-3 space-y-3 border-t border-lilac-100 pt-4">
              <div className="space-y-3 rounded-2xl bg-lilac-50 p-3">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-lilac-700">Contact information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-lilac-700">First name</label>
                      <input
                        required
                        value={customerName}
                        onChange={(e) => setCustomer(e.target.value, customerPhone)}
                        placeholder="e.g. Sarah"
                        className="w-full rounded-xl border border-lilac-200 bg-white px-3 py-2 text-sm outline-none focus:border-lilac-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-lilac-700">Phone number</label>
                      <input
                        required
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomer(customerName, e.target.value)}
                        placeholder="e.g. +213 555 123 456"
                        className="w-full rounded-xl border border-lilac-200 bg-white px-3 py-2 text-sm outline-none focus:border-lilac-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-lilac-700">Delivery details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-lilac-700">Delivery city</label>
                      <input
                        required
                        value={deliveryCity}
                        onChange={(e) => setDelivery(e.target.value, deliveryMode)}
                        placeholder="e.g. Algiers"
                        className="w-full rounded-xl border border-lilac-200 bg-white px-3 py-2 text-sm outline-none focus:border-lilac-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-lilac-700">Delivery method</label>
                      <select
                        value={deliveryMode}
                        onChange={(e) => setDelivery(deliveryCity, e.target.value as "relay" | "home")}
                        className="w-full rounded-xl border border-lilac-200 bg-white px-3 py-2 text-sm outline-none focus:border-lilac-500"
                      >
                        <option value="relay">Relay point — {formatPrice(450)}</option>
                        <option value="home">Home delivery — {formatPrice(500)} in Algiers, {formatPrice(750)} outside Algiers</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span>{formatPrice(shipping())}</span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>Total</span>
                <span className="font-display text-2xl font-semibold text-lilac-700">{formatPrice(total())}</span>
              </div>
              <button type="button" onClick={order} disabled={!canOrder} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lilac-700 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">
                <Copy size={18} /> Copy order message
              </button>
              <p className="text-center text-xs text-lilac-600">
                {!customerName.trim() && "Enter your first name to prepare the order. 👤"}
                {customerName.trim() && !customerPhone.trim() && "Enter your phone number to prepare the order. 📞"}
                {customerName.trim() && customerPhone.trim() && !deliveryCity.trim() && "Enter the delivery city to prepare the order. 📍"}
                {customerName.trim() && customerPhone.trim() && deliveryCity.trim() && copyState === "copied" && "The order message is copied. Paste it into Instagram and send it. 📋"}
                {customerName.trim() && customerPhone.trim() && deliveryCity.trim() && copyState === "failed" && "Copy was blocked. Select the message, copy it manually, and paste it into Instagram. 📋"}
                {customerName.trim() && customerPhone.trim() && deliveryCity.trim() && copyState === "idle" && "The delivery cost is included in the total. Copy the order message below. 📋"}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
