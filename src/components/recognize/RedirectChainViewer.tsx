"use client";

import { Icon } from "@/components/ui/Icon";

export type RedirectHop = string | { url: string; status?: number };

/**
 * Visual redirect chain hop diagram rendering sequential URL transitions,
 * detecting intermediate shorteners and deceptive redirects.
 *
 * @param chain - Array of chronological URLs or hops visited during inspection.
 */
export function RedirectChainViewer({ chain }: { chain: RedirectHop[] }) {
  if (!chain || chain.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-normal text-slate-500">
        <span>Rantai pengalihan alamat ({chain.length} langkah):</span>
        <span className="text-[11px] text-slate-400">Playwright egress tracer</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-2xs divide-y divide-slate-100">
        {chain.map((item, index) => {
          const isInitial = index === 0;
          const isFinal = index === chain.length - 1;
          const url = typeof item === "string" ? item : item.url;
          const status = typeof item === "object" && item.status ? item.status : null;

          let hostname = url;
          try {
            hostname = new URL(url).hostname;
          } catch {
            // fallback to raw
          }

          return (
            <div
              key={index}
              className="flex items-start gap-2.5 p-3 text-xs font-normal transition-colors hover:bg-slate-50/60"
            >
              {/* Step Index Number */}
              <span className="w-4 shrink-0 text-slate-400 font-mono text-xs mt-0.5">
                {index + 1}.
              </span>

              {/* Hop Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-900 font-mono text-xs">
                    {hostname}
                  </span>
                  {status && (
                    <span className="text-slate-400 font-mono text-xs">
                      · HTTP {status}
                    </span>
                  )}
                  {isInitial && (
                    <span className="text-slate-400 text-xs">
                      · Input awal
                    </span>
                  )}
                  {isFinal && (
                    <span className="text-[#FF3B30] text-xs">
                      · Tujuan akhir
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400 font-mono">
                  {url}
                </p>
              </div>

              {/* Arrow Indicator between hops */}
              {!isFinal && (
                <div className="shrink-0 text-slate-300 mt-0.5">
                  <Icon
                    icon="solar:arrow-down-linear"
                    className="h-3.5 w-3.5"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
