import type { CartItem, DeliveryMode } from "./cart-store";
import { formatPrice } from "./pricing";

const IG_USERNAME = "the_lovly_vault";

export function buildOrderMessage(
  items: CartItem[],
  subtotal: number,
  shipping: number,
  city: string,
  mode: DeliveryMode,
  total: number,
  customerName: string,
  customerPhone: string,
) {
  const lines = items
    .map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(Number(i.price) * i.qty)}`)
    .join("\n");
  const deliveryLabel = mode === "relay"
    ? "Relay point delivery"
    : "Home delivery";

  return `Hello 💜, I would like to order these items:\n${lines}\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nCity: ${city}\nDelivery: ${deliveryLabel}\nSubtotal: ${formatPrice(subtotal)}\nShipping: ${formatPrice(shipping)}\nTotal: ${formatPrice(total)}\n\nPlease confirm the order.`;
}

export async function copyOrderMessage(message: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return true;
    }
  } catch {
    // Continue with the browser fallback below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = message;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }

  return copied;
}

export function openInstagramDM(message: string) {
  const url = `https://ig.me/m/${IG_USERNAME}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
}
