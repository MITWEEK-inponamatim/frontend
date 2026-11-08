"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type RedirectHop = string | { url: string; status?: number };

const KNOWN_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "s.id",
  "cutt.ly",
  "is.gd",
  "buff.ly",
  "ow.ly",
  "rebrand.ly",
  "goo.gl",
  "linktr.ee",
  "bl.ink",
  "shorturl.at",
  "v.gd",
]);

/**
 * Extracts normalized hop metadata including host domain, path, shortener detection, and status.
 *
 * @param item - Raw string or structured redirect hop object.
 * @param index - Zero-based index of this hop within the chain.
 * @param total - Total count of hops in the redirect sequence.
 */
function getHopDetails(item: RedirectHop, index: number, total: number) {
  const url = typeof item === "string" ? item : item.url;
  const status = typeof item === "object" && item.status ? item.status : null;
  const isInitial = index === 0;
  const isFinal = index === total - 1;

  let hostname = url;
  let pathname = "";
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname;
    pathname = parsed.pathname + parsed.search;
  } catch {
    // Keep fallback raw text when URL parsing fails
  }

  const isShortener = isInitial && KNOWN_SHORTENERS.has(hostname.toLowerCase());

  let roleLabel = "Pengalihan";
  let roleBadgeClass = "bg-slate-100 text-slate-700 border-slate-200/80";

  if (isInitial) {
    if (isShortener) {
      roleLabel = "Shortener";
      roleBadgeClass = "bg-amber-50 text-amber-700 border-amber-200/80";
    } else {
      roleLabel = "Input awal";
      roleBadgeClass = "bg-slate-100 text-slate-700 border-slate-200/80";
    }
  } else if (isFinal) {
    roleLabel = "Tujuan akhir";
    roleBadgeClass = "bg-red-50 text-red-700 border-red-200/80";
  }

  return {
    url,
    hostname,
    pathname,
    status,
    isInitial,
    isFinal,
    isShortener,
    roleLabel,
    roleBadgeClass,
  };
}

/**
 * Visual redirect chain hop diagram rendering sequential URL transitions,
 * detecting intermediate shorteners and deceptive redirects with responsive
 * horizontal pipeline on desktop and vertical timeline on mobile.
 *
 * @param chain - Array of chronological URLs or hops visited during inspection.
 */
export function RedirectChainViewer({ chain }: { chain: RedirectHop[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!chain || chain.length === 0) return null;

  const handleCopy = (url: string, index: number) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex((current) => (current === index ? null : current));
    }, 2000);
  };

  return (
    <section className="space-y-3 text-left">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-normal text-slate-500">
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:link-linear" className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">Rantai pengalihan alamat:</span>
          <span>({chain.length} langkah)</span>
        </div>
      </div>

      {/* Desktop View: Horizontal Flow Pipeline */}
      <div className="hidden md:flex items-stretch overflow-x-auto pb-3 pt-1 no-scrollbar gap-2.5">
        {chain.map((item, index) => {
          const hop = getHopDetails(item, index, chain.length);
          const isCopied = copiedIndex === index;

          return (
            <div key={index} className="flex items-center gap-2.5 shrink-0">
              <div
                className={`w-64 flex flex-col justify-between rounded-2xl border bg-white p-3.5 shadow-2xs transition-shadow hover:shadow-xs ${
                  hop.isFinal
                    ? "border-red-200/80 ring-1 ring-red-100"
                    : "border-slate-200/90"
                }`}
              >
                {/* Card Top: Step & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-mono font-medium text-white">
                      {index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${hop.roleBadgeClass}`}
                    >
                      {hop.roleLabel}
                    </span>
                  </div>

                  {hop.status && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200/60">
                      HTTP {hop.status}
                    </span>
                  )}
                </div>

                {/* Card Middle: Host & Path */}
                <div className="space-y-0.5 my-1 min-w-0">
                  <span className="block font-mono text-xs font-semibold text-slate-900 truncate" title={hop.hostname}>
                    {hop.hostname}
                  </span>
                  <span className="block font-mono text-[11px] text-slate-400 break-all line-clamp-2 leading-relaxed" title={hop.url}>
                    {hop.pathname || "/"}
                  </span>
                </div>

                {/* Card Bottom: Copy Action */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Hop #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(hop.url, index)}
                    className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Icon
                      icon={isCopied ? "solar:check-circle-linear" : "solar:copy-linear"}
                      className={`h-3 w-3 ${isCopied ? "text-[#34C759]" : "text-slate-400"}`}
                    />
                    <span>{isCopied ? "Tersalin!" : "Salin URL"}</span>
                  </button>
                </div>
              </div>

              {/* Connecting Right Arrow between desktop hops */}
              {!hop.isFinal && (
                <div className="text-slate-300 shrink-0 px-0.5">
                  <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View: Vertical Step Timeline */}
      <div className="flex md:hidden flex-col space-y-2">
        {chain.map((item, index) => {
          const hop = getHopDetails(item, index, chain.length);
          const isCopied = copiedIndex === index;

          return (
            <div key={index} className="flex flex-col space-y-2">
              <div
                className={`rounded-2xl border bg-white p-3.5 shadow-2xs ${
                  hop.isFinal
                    ? "border-red-200/80 ring-1 ring-red-100"
                    : "border-slate-200/90"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-mono font-medium text-white">
                      {index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${hop.roleBadgeClass}`}
                    >
                      {hop.roleLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hop.status && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200/60">
                        HTTP {hop.status}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(hop.url, index)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <Icon
                        icon={isCopied ? "solar:check-circle-linear" : "solar:copy-linear"}
                        className={`h-3 w-3 ${isCopied ? "text-[#34C759]" : "text-slate-400"}`}
                      />
                      <span>{isCopied ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <span className="block font-mono text-xs font-semibold text-slate-900 truncate">
                    {hop.hostname}
                  </span>
                  <p className="font-mono text-[11px] text-slate-500 break-all leading-relaxed">
                    {hop.url}
                  </p>
                </div>
              </div>

              {/* Connecting Down Arrow on mobile */}
              {!hop.isFinal && (
                <div className="flex justify-center text-slate-300 py-0.5">
                  <Icon icon="solar:arrow-down-linear" className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
