"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { safeAdminNext } from "@/lib/paths";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const FIELD =
  "w-full rounded-xl border border-gray-300 px-4 py-3 text-[15px] text-gray-900 outline-none " +
  "transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25";

/**
 * The door of the moderation desk. It asks for an account, then for the moderator role: a session
 * alone is not enough, because every citizen of ThreatLens has one, and only a few may decide what
 * the board shows. The password never reaches the Go API — Supabase answers, and the API only ever
 * reports the role it has stored.
 */
export function AdminLogin({ reason, next }: { reason: string; next: string }) {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const widget = useRef("");

  const notice =
    reason === "idle"
      ? "Sesi moderasi berakhir karena tidak ada aktivitas selama 1 jam. Masuk lagi untuk melanjutkan."
      : reason === "forbidden"
        ? "Akun ini masuk, tapi tidak punya peran moderator. Gunakan akun yang diberi role admin."
        : "";

  // A moderator who is already signed in with the right account should not have to type anything;
  // one who is signed in with the wrong account has to be told, not silently bounced.
  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setChecking(false);
        return;
      }
      try {
        const role = (await api("/api/v1/admin/me")) as { role?: string };
        if (role?.role === "admin") {
          location.replace(safeAdminNext(next));
          return;
        }
        setError("Akun ini masuk, tapi tidak punya peran moderator. Gunakan akun yang diberi role admin.");
      } catch {
        setError("Layanan tidak dapat membaca peran akun ini. Coba lagi sebentar.");
      }
      setChecking(false);
    })();
  }, [next]);

  const renderCaptcha = () => {
    const el = document.getElementById("admin-turnstile");
    if (!el || widget.current || !window.turnstile) return;
    widget.current = window.turnstile.render(el, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      // "login" and nothing else: the API refuses a token whose action is not this word
      // (backend/main.go::verifyTurnstile), so the desk's door has to speak the same one.
      action: "login",
      callback: (value: string) => {
        setToken(value);
        setError("");
      },
      "expired-callback": () => setToken(""),
      "error-callback": () => setError("Verifikasi keamanan gagal dimuat. Muat ulang halaman."),
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || busy) return;
    setBusy(true);
    setError("");

    try {
      const verified = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/turnstile/verify`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );
      if (!verified.ok) {
        // A verification service that is unreachable or throttled is not a failed human check, so the
        // token survives: the moderator retries without solving the widget a second time.
        const keepToken = verified.status === 429 || verified.status === 502 || verified.status === 503;
        setError(
          verified.status === 429
            ? "Terlalu sering mencoba. Tunggu sebentar, lalu klik lagi."
            : keepToken
              ? "Layanan verifikasi bot sedang tidak dapat dihubungi. Coba lagi sebentar."
              : "Verifikasi bot tidak valid. Centang kotak verifikasi lagi.",
        );
        if (!keepToken) {
          window.turnstile?.reset(widget.current);
          setToken("");
        }
        setBusy(false);
        return;
      }

      const supabase = createClient();
      const { data: signedIn, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError || !signedIn.session) {
        setError(
          authError?.message === "Invalid login credentials"
            ? "Email atau password salah."
            : "Masuk gagal. Coba beberapa saat lagi.",
        );
        setBusy(false);
        return;
      }

      // Supabase knows the account now, but the Go API keeps its own list of open sessions and only
      // opens one when the captcha preflight it just handed us is spent. The OAuth callback does the
      // same thing; without it every call behind this door comes back `session_required`.
      const finalized = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/session/finalize`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${signedIn.session.access_token}` },
      });
      if (!finalized.ok) {
        await supabase.auth.signOut({ scope: "local" });
        setError("Sesi masuk tidak dapat dibuka. Coba lagi sebentar.");
        setBusy(false);
        return;
      }

      // The session exists now, so the role can be read. A non-admin gets the session taken back:
      // leaving it would hand them every ordinary account's privileges behind a moderator's door.
      try {
        const role = (await api("/api/v1/admin/me")) as { role?: string };
        if (role?.role !== "admin") {
          await supabase.auth.signOut({ scope: "local" });
          setError("Akun ini masuk, tapi tidak punya peran moderator. Gunakan akun yang diberi role admin.");
          setBusy(false);
          return;
        }
      } catch {
        await supabase.auth.signOut({ scope: "local" });
        setError("Layanan tidak dapat memastikan peran akun ini. Coba lagi sebentar.");
        setBusy(false);
        return;
      }

      // A full navigation: the session cookie has to be in the request before the desk renders.
      location.assign(safeAdminNext(next));
    } catch {
      setError("Gagal menghubungi server verifikasi. Periksa koneksi internet Anda.");
      setBusy(false);
    }
  };

  const locked = !token || busy || checking;

  return (
    <div className="flex min-h-dvh w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* The desk's face. Under lg it gives the whole screen to the form instead of stacking. */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/admin-door.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <Link
          href="/"
          aria-label="Kembali ke ThreatLens"
          className={`absolute top-6 left-6 z-10 flex size-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 ${FOCUS}`}
        >
          <Icon icon="solar:arrow-left-linear" aria-hidden="true" className="size-5" />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className={`mb-6 inline-flex items-center gap-1.5 text-[13.5px] text-gray-500 hover:text-gray-800 lg:hidden ${FOCUS}`}
          >
            <Icon icon="solar:arrow-left-linear" aria-hidden="true" className="size-4" />
            Kembali ke ThreatLens
          </Link>

          <div className="mb-8">
            <h1 className="mb-2 text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-gray-900">
              Selamat datang kembali
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-600">
              Halaman ini hanya untuk akun moderator. Warga biasa masuk lewat{" "}
              <Link href="/login" className={`font-medium text-blue-600 hover:text-blue-700 ${FOCUS}`}>
                halaman masuk biasa
              </Link>
              .
            </p>
          </div>

          {notice && !error && (
            <p className="mb-6 flex items-start gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-[13.5px] leading-[1.5] text-slate-700">
              <Icon icon="solar:clock-circle-linear" aria-hidden="true" className="mt-px size-[17px] shrink-0 text-slate-400" />
              {notice}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] leading-[1.5] text-red-700"
            >
              <Icon icon="solar:danger-triangle-linear" aria-hidden="true" className="mt-px size-[17px] shrink-0" />
              {error}
            </p>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-gray-700">
                Email moderator
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                placeholder="Email moderator"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Password"
                  className={`${FIELD} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  aria-pressed={showPassword}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${FOCUS}`}
                >
                  <Icon
                    icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"}
                    aria-hidden="true"
                    className="size-5"
                  />
                </button>
              </div>
            </div>

            <div className="min-h-[66px]">
              <div id="admin-turnstile" className="flex min-h-[66px] items-center justify-center" />
              {!token && !checking && (
                <p className="mt-2 text-[12.5px] leading-[1.5] text-gray-500">
                  Centang kotak verifikasi di atas untuk mengaktifkan tombolnya.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={locked}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium text-white transition-colors ${FOCUS} ${
                locked ? "cursor-not-allowed bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
            >
              {busy || checking ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-[13px] animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
                  />
                  Memeriksa akun
                </>
              ) : (
                "Masuk ke meja"
              )}
            </button>
          </form>

          <p className="mt-8 text-[12.5px] leading-[1.6] text-gray-500">
            Sesi berakhir otomatis setelah 1 jam tanpa aktivitas.
          </p>
        </div>
      </div>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderCaptcha}
      />
    </div>
  );
}
