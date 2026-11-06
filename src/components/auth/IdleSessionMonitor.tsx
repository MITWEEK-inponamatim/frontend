"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";

const IDLE_MS = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_SECONDS ?? 3600) * 1000;
const WARNING_MS = 120_000;
const ACTIVITY_FLOOR_MS = 30_000;
const HEARTBEAT_MS = 5 * 60_000;
const STORAGE_KEY = "threatlens:last-activity";

export function IdleSessionMonitor() {
  const [warning, setWarning] = useState(false); const router = useRouter();
  const markActive = useCallback(() => {
    const now = Date.now();
    sessionStorage.setItem(STORAGE_KEY, String(now));
    setWarning(false);
    return now;
  }, []);

  useEffect(() => {
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("threatlens-session") : null;
    let lastHeartbeat = 0;
    const getLast = () => Number(sessionStorage.getItem(STORAGE_KEY));
    const update = () => channel?.postMessage(markActive());
    // sessionStorage, not localStorage: one tab keeps its own idle clock through the OAuth
    // round-trip, but a fresh visit counts from now. A key that outlived logout made anybody
    // signing in again after an hour away get signed straight back out, on every retry.
    const onRemote = (event: MessageEvent<number | string>) => {
      if (typeof event.data === "number") { sessionStorage.setItem(STORAGE_KEY, String(event.data)); setWarning(false); }
      else if (event.data === "logout") router.replace("/login?reason=idle");
    };
    const activity = () => { if (Date.now() - getLast() > ACTIVITY_FLOOR_MS) update(); };
    const verify = async () => {
      const remaining = IDLE_MS - (Date.now() - getLast());
      if (remaining <= 0) {
        channel?.postMessage("logout");
        // An idle timeout closes this tab's session only; the default global scope would also
        // revoke the user's refresh token on their other devices.
        await createClient().auth.signOut({ scope: "local" });
        router.replace("/login?reason=idle");
        return;
      }
      setWarning(remaining <= WARNING_MS);
      if (Date.now() - lastHeartbeat > HEARTBEAT_MS && Date.now() - getLast() < HEARTBEAT_MS) {
        lastHeartbeat = Date.now();
        await api("/api/v1/auth/session/heartbeat", { method: "POST" }).catch(() => {});
      }
    };
    update();
    const events = ["pointerdown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((name) => addEventListener(name, activity, { passive: true }));
    addEventListener("focus", activity);
    document.addEventListener("visibilitychange", activity);
    channel?.addEventListener("message", onRemote);
    const timer = setInterval(verify, 1000);
    return () => {
      clearInterval(timer);
      events.forEach((name) => removeEventListener(name, activity));
      removeEventListener("focus", activity);
      document.removeEventListener("visibilitychange", activity);
      channel?.close();
    };
  }, [router, markActive]);

  if (!warning) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="idle-title" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-w-sm rounded-2xl bg-white p-6">
        <h2 id="idle-title" className="text-xl font-medium">Sesi segera berakhir</h2>
        <p className="mt-2 text-slate-600">Tetap masuk untuk melanjutkan.</p>
        <button autoFocus className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-white" onClick={() => { markActive(); void api("/api/v1/auth/session/heartbeat", { method: "POST" }).catch(() => {}); }}>Tetap masuk</button>
      </div>
    </div>
  );
}
