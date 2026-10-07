"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";

const empty = { name: "", price: "", description: "" };

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Product | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="py-20 text-center">Loading…</p>;
  if (!user || !isAdmin)
    return (
      <div className="py-20 text-center">
        <p className="mb-4">Administrator access only 🔒</p>
        <Link href="/login" className="text-lilac-600 underline">Sign in</Link>
      </div>
    );

  const reset = () => { setForm(empty); setEditing(null); setFile(null); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    let image_url = editing?.image_url ?? null;
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await supabase.storage.from("products").upload(path, file);
      if (error) { setBusy(false); return setMsg("Upload failed: " + error.message); }
      image_url = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
    }
    const row = { name: form.name, price: Number(form.price), description: form.description, image_url };
    const { error } = editing
      ? await supabase.from("products").update(row).eq("id", editing.id)
      : await supabase.from("products").insert(row);
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg(editing ? "Article updated ✅" : "Article added ✅");
    reset(); load();
  };

  const edit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, price: String(p.price), description: p.description ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (p: Product) => {
    if (!confirm(`Delete “${p.name}”?`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    load();
  };

  return (
    <div className="space-y-8 py-8">
      <h1 className="font-display text-3xl text-lilac-700">Dashboard</h1>

      <form onSubmit={save} className="space-y-3 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="font-display text-xl">{editing ? "Edit article" : "Add an article"}</h2>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-lilac-300 p-4 text-sm text-lilac-600">
          <ImagePlus size={22} />
          {file ? file.name : editing ? "Change photo (optional)" : "Choose a photo"}
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <input className="input" required placeholder="Article name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" required type="number" step="1" min="0" placeholder="Price (DA)"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <textarea className="input" rows={2} placeholder="Short description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {msg && <p className="text-sm text-lilac-700">{msg}</p>}
        <button className="btn" disabled={busy || (!editing && !file)}>
          {busy ? "Saving…" : editing ? "Save" : "Add"}
        </button>
        {editing && <button type="button" onClick={reset} className="w-full text-sm text-lilac-600 underline">Cancel</button>}
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.image_url && <img src={p.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-sm text-lilac-600">{formatPrice(p.price)}</p>
            </div>
            <button onClick={() => edit(p)} aria-label="Edit article" className="rounded-full p-2 text-lilac-700 hover:bg-lilac-100"><Pencil size={18} /></button>
            <button onClick={() => del(p)} aria-label="Delete article" className="rounded-full p-2 text-lilac-700 hover:bg-lilac-100"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
