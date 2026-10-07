export type DeliveryMode = "relay" | "home";

export function getShippingPrice(city: string, mode: DeliveryMode) {
  const normalizedCity = city.trim().toLowerCase();

  if (mode === "relay") return 450;
  if (normalizedCity === "alger" || normalizedCity === "algiers") return 500;
  return 750;
}

export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}
