"use client";

import Script from "next/script";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

declare global { interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void } } }

export default function LoginPage() {
  const [token, setToken] = useState(""); const [widget, setWidget] = useState(""); const [error, setError] = useState("");
  const renderCaptcha = () => { if (!window.turnstile || widget) return; setWidget(window.turnstile.render(document.getElementById("turnstile")!, { sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, action: "login", callback: setToken, "expired-callback": () => setToken(""), "error-callback": () => setError("Verifikasi CAPTCHA gagal. Muat ulang halaman.") })); };
  const login = async () => {
    const verified = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/turnstile/verify`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    if (!verified.ok) { setError("Verifikasi CAPTCHA gagal. Coba lagi."); window.turnstile?.reset(widget); setToken(""); return; }
    const next = new URLSearchParams(location.search).get("next") ?? "/recognize";
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`, scopes: "openid email profile" } });
    if (error) setError("Login Google gagal. Coba lagi.");
  };
  const params = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(location.search);
  const reason = params.get("reason");
  const message = reason === "idle" ? "Sesi berakhir karena tidak ada aktivitas." : reason === "oauth_error" ? "Login Google gagal. Periksa konfigurasi OAuth, lalu coba lagi." : reason === "session_required" ? "Sesi belum dapat diaktifkan. Coba login kembali." : "";
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-3xl font-medium">Masuk ke ThreatLens</h1><p className="mt-2 text-slate-600">Gunakan akun Google untuk memindai ancaman.</p>{message && <p role="alert" className="mt-4 text-amber-800">{message}</p>}<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={renderCaptcha}/><div id="turnstile" className="mt-6"/><button disabled={!token} onClick={login} className="mt-4 rounded-full bg-slate-900 px-5 py-3 text-white disabled:opacity-40">Masuk dengan Google</button>{error && <p role="alert" className="mt-3 text-red-700">{error}</p>}</main>;
}
