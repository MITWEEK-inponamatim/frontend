"use client";

/**
 * Renders an authentic iOS mobile status bar with clock, cellular, wifi, and battery indicators.
 *
 * @param time - Current mobile clock display, defaulting to 9:41.
 */
export function WhatsAppStatusBar({ time = "9:41" }: { time?: string }) {
  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-between px-6 bg-[#F6F6F6] text-slate-900 select-none border-b border-slate-200/40">
      <span className="text-[14px] font-normal tracking-tight text-slate-900">
        {time}
      </span>
      <div className="flex items-center gap-1.5 text-slate-900">
        {/* Cellular Signal 4 bars */}
        <svg viewBox="0 0 18 12" className="h-3 w-4 fill-current">
          <rect x="0" y="9" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg viewBox="0 0 16 12" className="h-3 w-3.5 fill-current">
          <path d="M8 2.5a10.9 10.9 0 016.36 2.04.75.75 0 01-.1 1.18l-1.03.82a.75.75 0 01-1.02-.08A7.47 7.47 0 008 4.75c-1.6 0-3.07.5-4.21 1.71a.75.75 0 01-1.02.08l-1.03-.82a.75.75 0 01-.1-1.18A10.9 10.9 0 018 2.5zm0 4.5a6.45 6.45 0 013.68 1.15.75.75 0 01.03 1.2l-3.23 2.58a.75.75 0 01-.96 0L4.29 9.35a.75.75 0 01.03-1.2A6.45 6.45 0 018 7z" />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center">
          <div className="relative h-3 w-6 rounded-[3.5px] border border-slate-900 p-0.5">
            <div className="h-full w-full rounded-[1.5px] bg-slate-900" />
          </div>
          <div className="h-1.5 w-0.5 rounded-r-[1px] bg-slate-900" />
        </div>
      </div>
    </div>
  );
}

