import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/cart-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <>
      <section className="py-10 text-center">
        <p className="text-sm tracking-[0.3em] text-lilac-400">New collection</p>
        <h1 className="mt-2 font-display text-4xl text-lilac-800 sm:text-5xl">
          All our articles are at your disposal 💖
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-lilac-800/70">
          Add your favorites to the cart, then complete your order in one click through Instagram 💜
        </p>
      </section>

      {products.length === 0 ? (
        <p className="py-20 text-center text-lilac-600">Our articles are arriving soon 💫</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}
