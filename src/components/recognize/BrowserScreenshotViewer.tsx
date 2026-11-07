"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Encapsulated browser screenshot viewer captured by isolated Playwright worker,
 * featuring a default safe-blur toggle to protect users from active phishing deception.
 *
 * @param screenshotUrl - Signed URL or storage path to the browser screenshot.
 */
export function BrowserScreenshotViewer({
  screenshotUrl,
}: {
  screenshotUrl?: string | null;
}) {
  const [isBlurred, setIsBlurred] = useState(true);

  if (!screenshotUrl) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-normal text-slate-500">
        <span className="flex items-center gap-1.5">
          <Icon icon="solar:camera-linear" className="h-3.5 w-3.5" />
          <span>Tangkapan layar browser terisolasi:</span>
        </span>

        <button
          type="button"
          onClick={() => setIsBlurred((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs font-normal text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Icon
            icon={isBlurred ? "solar:eye-linear" : "solar:eye-closed-linear"}
            className="h-3.5 w-3.5 text-slate-400"
          />
          <span>{isBlurred ? "Buka sensor" : "Sensor kembali"}</span>
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-2xs group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotUrl}
          alt="Tangkapan layar halaman situs hasil pemindaian Playwright"
          loading="lazy"
          className={`w-full max-h-[380px] object-cover object-top transition-all duration-300 ${
            isBlurred
              ? "blur-md scale-102 brightness-90 select-none pointer-events-none"
              : "blur-0 scale-100 brightness-100"
          }`}
        />

        {/* Safe-blur warning overlay when blurred */}
        {isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/40 text-white select-none">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 mb-2">
              <Icon icon="solar:shield-warning-linear" className="h-4 w-4" />
            </div>
            <p className="text-xs font-normal max-w-sm text-slate-200">
              Tangkapan layar disensor otomatis untuk melindungi dari konten tipuan visual aktif.
            </p>
            <button
              type="button"
              onClick={() => setIsBlurred(false)}
              className="mt-3 rounded-xl bg-white text-slate-900 px-3.5 py-1.5 text-xs font-normal hover:bg-slate-100 transition-colors shadow-2xs"
            >
              Tampilkan gambar asli
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

