"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ErrorToast, InfoToast } from "@/components/ui/Toast";
import { Navbar } from "@/components/navbar/Navbar";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

/**
 * Handles user authentication via Google OAuth guarded by Cloudflare Turnstile bot verification.
 */
export default function LoginPage() {
  const [token, setToken] = useState("");
  const [widget, setWidget] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initializes and renders Cloudflare Turnstile captcha widget.
   */
  const renderCaptcha = () => {
    if (!window.turnstile || widget) return;
    const el = document.getElementById("turnstile");
    if (!el) return;

    setWidget(
      window.turnstile.render(el, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        action: "login",
        callback: (tok: string) => {
          setToken(tok);
          setError("");
        },
        "expired-callback": () => setToken(""),
        "error-callback": () =>
          setError("Verifikasi keamanan gagal dimuat. Muat ulang halaman."),
      }),
    );
  };

  /**
   * Verifies the Turnstile token with backend and initiates Google OAuth sign-in.
   */
  const handleGoogleLogin = async () => {
    if (!token || isLoading) return;
    setIsLoading(true);
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
        setError("Verifikasi bot tidak valid. Silakan verifikasi ulang.");
        window.turnstile?.reset(widget);
        setToken("");
        setIsLoading(false);
        return;
      }

      const next =
        new URLSearchParams(location.search).get("next") ?? "/recognize";
      const { error: authError } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          scopes: "openid email profile",
        },
      });

      if (authError) {
        setError("Autentikasi Google gagal. Coba beberapa saat lagi.");
        setIsLoading(false);
      }
    } catch {
      setError(
        "Gagal menghubungi server verifikasi. Periksa koneksi internet Anda.",
      );
      setIsLoading(false);
    }
  };

  const params =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(location.search);
  const reason = params.get("reason");
  const notificationMessage =
    reason === "idle"
      ? "Sesi Anda berakhir karena tidak ada aktivitas selama 1 jam. Silakan masuk kembali."
      : reason === "oauth_error"
        ? "Login Google gagal atau dibatalkan. Silakan coba kembali."
        : reason === "session_required"
          ? "Autentikasi diperlukan untuk mengakses halaman ini."
          : "";

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Background Circular/Elliptical Red Accent Gradient at the Top (Behind Card) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 sm:-top-56 lg:-top-72 left-1/2 -translate-x-1/2 w-[580px] sm:w-[820px] md:w-[1100px] lg:w-[1550px] xl:w-[1550px] h-[500px] sm:h-[650px] lg:h-[620px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.42)_0%,rgba(239,68,68,0.22)_40%,rgba(239,68,68,0.06)_65%,transparent_75%)]" />
      </div>

      {/* Universal Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex items-center justify-center py-6 sm:py-8 px-4 sm:px-6">
        <div className="w-full flex justify-center">
          {/* Form Card (Mobile-first centered container, matching mockup) */}
          <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-sm flex flex-col items-center text-center">
            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
              Hi There!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs">
              Selesaikan verifikasi keamanan singkat di bawah untuk melanjutkan
              masuk dengan Google.
            </p>

            {/* Status & Error Toasts */}
            {notificationMessage && (
              <InfoToast
                title="Pemberitahuan Sesi"
                description={notificationMessage}
                className="mt-5"
              />
            )}

            {error && (
              <ErrorToast
                title="Peringatan Masuk"
                description={error}
                className="mt-5"
              />
            )}

            {/* Turnstile Container (Neatly Centered) */}
            <div className="w-full mt-6 flex flex-col items-center min-h-[66px] justify-center">
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
                onLoad={renderCaptcha}
              />
              <div
                id="turnstile"
                className="overflow-hidden flex justify-center"
              />
              {!token && (
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Centang kotak verifikasi di atas untuk mengaktifkan tombol
                </span>
              )}
            </div>

            {/* Primary Action Button: White Button with Subtle Border & Google G */}
            <button
              type="button"
              disabled={!token || isLoading}
              onClick={handleGoogleLogin}
              className={`w-full mt-5 py-3.5 px-5 rounded-full flex items-center justify-center gap-3 text-sm font-medium transition-all ${
                !token || isLoading
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75"
                  : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
              }`}
              aria-label="Masuk menggunakan akun Google"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  Menghubungkan ke Google...
                </span>
              ) : (
                <>
                  {/* Official Google 'G' SVG Logo */}
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <span>Lanjutkan dengan Google</span>
                </>
              )}
            </button>

            {/* Informative Note */}
            <p className="mt-4 text-[11px] text-slate-400 leading-relaxed max-w-xs">
              ThreatLens hanya memakai profil dasar Google (nama dan email)
              untuk identifikasi sesi aman Anda.
            </p>

            {/* Footer Links */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <Link
                href="/guide"
                className="hover:text-slate-700 transition-colors"
              >
                Panduan Keamanan
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-slate-700 transition-colors">
                Privasi & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto pt-6 text-center text-xs text-slate-400">
        System.
      </footer>
    </div>
  );
}
