"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Encapsulated browser screenshot sandbox mockup captured by isolated Playwright egress worker,
 * featuring safe-blur protection against phishing and interactive fullscreen inspection.
 *
 * @param screenshotUrl - Signed URL or storage path to the browser screenshot.
 * @param targetUrl - Optional target URL displayed inside the sandbox address bar.
 */
export function BrowserScreenshotViewer({
  screenshotUrl,
  targetUrl,
}: {
  screenshotUrl?: string | null;
  targetUrl?: string;
}) {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  if (!screenshotUrl) return null;

  let displayDomain = "sesi-terisolasi";
  if (targetUrl) {
    try {
      displayDomain = new URL(targetUrl).hostname;
    } catch {
      displayDomain = targetUrl;
    }
  }

  return (
    <>
      <section className="space-y-3 text-left">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-normal text-slate-500">
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:camera-linear" className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">Tangkapan layar tampilan situs:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBlurred((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Icon
                icon={isBlurred ? "solar:eye-linear" : "solar:eye-closed-linear"}
                className="h-3.5 w-3.5 text-slate-400"
              />
              <span>{isBlurred ? "Buka sensor" : "Sensor kembali"}</span>
            </button>

            {!hasError && (
              <button
                type="button"
                onClick={() => {
                  setIsBlurred(false);
                  setIsFullscreen(true);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors pl-2 border-l border-slate-200"
              >
                <Icon icon="solar:maximize-square-linear" className="h-3.5 w-3.5 text-slate-400" />
                <span>Inspeksi</span>
              </button>
            )}
          </div>
        </div>

        {/* Browser Sandbox Mockup Window */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Mockup Titlebar / Chrome */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-3.5 py-2">
            {/* 3 Neutral Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>

            {/* Address Bar Pill */}
            <div className="mx-2 flex min-w-0 flex-1 max-w-sm items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] font-mono text-slate-600 shadow-2xs">
              <Icon icon="solar:lock-linear" className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{targetUrl || displayDomain}</span>
            </div>

            <div className="w-12 shrink-0" />
          </div>

          {/* Screenshot Viewport */}
          <div className="relative min-h-[220px] max-h-[420px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
            {hasError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                <Icon icon="solar:shield-warning-linear" className="h-8 w-8 text-slate-500" />
                <p className="text-xs">Tangkapan layar tidak dapat dimuat atau telah kedaluwarsa.</p>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotUrl}
                  alt="Tangkapan layar halaman situs target"
                  loading="lazy"
                  onError={() => setHasError(true)}
                  className={`w-full max-h-[420px] object-cover object-top transition-all duration-300 ${
                    isBlurred
                      ? "blur-md scale-102 brightness-90 select-none pointer-events-none"
                      : "blur-0 scale-100 brightness-100 cursor-zoom-in"
                  }`}
                  onClick={() => {
                    if (!isBlurred) setIsFullscreen(true);
                  }}
                />

                {/* Safe-blur Warning Overlay */}
                {isBlurred && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/45 text-white select-none">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 mb-2.5 backdrop-blur-xs">
                      <Icon icon="solar:shield-warning-linear" className="h-5 w-5 text-amber-300" />
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Tangkapan Layar Disensor Otomatis
                    </p>
                    <p className="text-[11px] font-normal max-w-sm text-slate-200 mt-1">
                      Visual target disensor untuk melindungi dari konten tipuan visual aktif, spoofing, atau malware.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsBlurred(false)}
                      className="mt-3.5 rounded-xl bg-white text-slate-900 px-4 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <Icon icon="solar:eye-linear" className="h-3.5 w-3.5 text-slate-700" />
                      <span>Tampilkan Gambar Asli</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Interactive Modal Zoom */}
      {isFullscreen && !hasError && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inspeksi tangkapan layar browser"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/90 p-4 sm:p-6 backdrop-blur-xs"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between text-white pb-3 border-b border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">
                Inspeksi Visual: {targetUrl || displayDomain}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tekan ESC atau klik area luar untuk menutup
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Tutup inspeksi"
              >
                <Icon icon="solar:close-circle-linear" className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Image Body */}
          <div
            className="flex-1 flex items-center justify-center overflow-auto py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Inspeksi resolusi penuh tangkapan layar"
              className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-800"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 text-center text-[11px] text-slate-500 font-mono">
            Dokumentasi visual ThreatLens • Diambil saat audit tautan
          </div>
        </div>
      )}
    </>
  );
}
