"use client";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/cart-store";

export default function ProductCatalog({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);

  const refreshProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts((data ?? []) as Product[]);
  }, []);

  useEffect(() => {
    void refreshProducts();
    const interval = window.setInterval(refreshProducts, 30_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshProducts();
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshProducts]);

  if (products.length === 0) {
    return <p className="py-20 text-center text-lilac-600">Our articles are arriving soon 💫</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}