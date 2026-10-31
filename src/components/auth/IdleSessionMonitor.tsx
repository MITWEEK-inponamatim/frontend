"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";

const IDLE_MS = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_SECONDS ?? 3600) * 1000;
const STORAGE_KEY = "threatlens:last-activity";

export function IdleSessionMonitor() {
  const [warning, setWarning] = useState(false); const router = useRouter();
  useEffect(() => {
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("threatlens-session") : null;
    let lastHeartbeat = 0;
    const getLast = () => Number(localStorage.getItem(STORAGE_KEY) || Date.now());
    const update = () => { const now = Date.now(); localStorage.setItem(STORAGE_KEY, String(now)); channel?.postMessage(now); setWarning(false); };
    const onRemote = (event: MessageEvent<number>) => { if (typeof event.data === "number") { localStorage.setItem(STORAGE_KEY, String(event.data)); setWarning(false); } else if (event.data === "logout") router.replace("/login?reason=idle"); };
    const activity = () => { if (Date.now() - getLast() > 30_000) update(); };
    const verify = async () => {
      const remaining = IDLE_MS - (Date.now() - getLast());
      if (remaining <= 0) { channel?.postMessage("logout"); await createClient().auth.signOut(); router.replace("/login?reason=idle"); return; }
      setWarning(remaining <= 120_000);
      if (Date.now() - lastHeartbeat > 5 * 60_000 && Date.now() - getLast() < 5 * 60_000) { lastHeartbeat = Date.now(); await api("/api/v1/auth/session/heartbeat", { method: "POST" }).catch(() => {}); }
    };
    if (!localStorage.getItem(STORAGE_KEY)) update();
    const events = ["pointerdown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((name) => addEventListener(name, activity, { passive: true }));
    addEventListener("focus", activity); document.addEventListener("visibilitychange", activity); channel?.addEventListener("message", onRemote);
    const timer = setInterval(verify, 1000);
    return () => { clearInterval(timer); events.forEach((name) => removeEventListener(name, activity)); removeEventListener("focus", activity); document.removeEventListener("visibilitychange", activity); channel?.close(); };
  }, [router]);
  return warning ? <div role="dialog" aria-modal="true" aria-labelledby="idle-title" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="max-w-sm rounded-2xl bg-white p-6"><h2 id="idle-title" className="text-xl font-medium">Sesi segera berakhir</h2><p className="mt-2 text-slate-600">Tetap masuk untuk melanjutkan.</p><button autoFocus className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-white" onClick={() => { localStorage.setItem(STORAGE_KEY, String(Date.now())); void api("/api/v1/auth/session/heartbeat", { method: "POST" }); setWarning(false); }}>Tetap masuk</button></div></div> : null;
}
