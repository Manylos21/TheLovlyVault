"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    const { error, data } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (mode === "signup" && !data.session)
      return setMsg("Account created! Check your email to confirm your address 💌");
    router.push("/");
  };

  if (user) {
    return (
      <div className="mx-auto mt-12 max-w-sm space-y-4 rounded-3xl bg-white p-6 text-center shadow-soft">
        <h1 className="font-display text-2xl text-lilac-700">My account</h1>
        <p className="break-all text-sm">{user.email}</p>
        {isAdmin && <a href="/admin" className="btn">Open admin dashboard</a>}
        <button onClick={() => supabase.auth.signOut()}
          className="text-sm text-lilac-600 underline">Sign out</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-12 max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-soft">
      <h1 className="text-center font-display text-3xl text-lilac-700">
        {mode === "login" ? "Sign in" : "Create an account"}
      </h1>
      <input className="input" type="email" required placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" type="password" required minLength={6} placeholder="Password (minimum 6 characters)"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      {msg && <p className="text-center text-sm text-lilac-700">{msg}</p>}
      <button className="btn" disabled={busy}>
        {mode === "login" ? "Sign in" : "Sign up"}
      </button>
      <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="block w-full text-center text-sm text-lilac-600 underline">
        {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
