"use client";
import Link from "next/link";
import { ShoppingBag, User, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const count = useCart((s) => s.count());
  const toggle = useCart((s) => s.toggle);
  const { isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 border-b border-lilac-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl text-lilac-700">
          The Lovely Vault <span className="text-lilac-400">✦</span>
        </Link>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <Link href="/admin" aria-label="Admin dashboard"
              className="rounded-full p-2 text-lilac-700 hover:bg-lilac-100">
              <LayoutDashboard size={22} />
            </Link>
          )}
          <Link href="/login" aria-label="My account"
            className="rounded-full p-2 text-lilac-700 hover:bg-lilac-100">
            <User size={22} />
          </Link>
          <button onClick={() => toggle()} aria-label="Open cart"
            className="relative rounded-full p-2 text-lilac-700 hover:bg-lilac-100">
            <ShoppingBag size={22} />
            {mounted && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-lilac-600 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
