"use client";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

/** Revokes the server session, then clears the Supabase session and returns to the landing page. */
export function LogoutButton({ className = "inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors" }: { className?: string }) {
  const router = useRouter();
  return (
    <button type="button" aria-label="Keluar dari akun"
      onClick={async () => { await api("/api/v1/auth/logout", { method: "POST" }).catch(() => {}); await createClient().auth.signOut(); router.replace("/"); }}
      className={className}>
      <Icon icon="solar:logout-2-bold-duotone" className="h-4 w-4" />
      <span>Keluar</span>
    </button>
  );
}
