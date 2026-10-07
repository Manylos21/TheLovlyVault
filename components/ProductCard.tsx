"use client";
import { Plus } from "lucide-react";
import { useCart, type Product } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="aspect-square overflow-hidden bg-lilac-100">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="space-y-1 p-3 sm:p-4">
        <h3 className="font-display text-base leading-tight sm:text-lg">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-lilac-800/70 sm:text-sm">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-lilac-700">
            {formatPrice(product.price)}
          </span>
          <button onClick={() => add(product)} aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-lilac-600 text-white transition hover:bg-lilac-700 active:scale-90">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
