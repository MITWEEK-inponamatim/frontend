"use client";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ConfirmButton } from "@/components/ui/ConfirmDialog";

/** Revokes the server session, then clears the Supabase session and returns to the landing page. */
export function LogoutButton({ className = "inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors" }: { className?: string }) {
  const router = useRouter();
  const signOut = async () => {
    await api("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
    await createClient().auth.signOut();
    router.replace("/");
    return true;
  };
  return (
    <ConfirmButton
      onConfirm={signOut}
      triggerTitle="Keluar dari akun"
      triggerClassName={className}
      label={
        <>
          <Icon icon="solar:logout-2-bold-duotone" className="h-4 w-4" aria-hidden="true" />
          <span>Keluar</span>
        </>
      }
      confirmTitle="Keluar dari akun?"
      confirmLabel="Ya, keluar"
      busyLabel="Keluar..."
      body={
        <p>
          Sesi di perangkat ini ditutup. Cerita dan riwayat pindai Anda tetap tersimpan — masuk lagi
          kapan pun untuk membukanya kembali.
        </p>
      }
    />
  );
}
