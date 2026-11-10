"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ConfirmButton } from "@/components/ui/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";

export type AccountProps = {
  email?: string;
  avatarUrl?: string | null;
  name?: string | null;
};

/**
 * Account badge with embedded compact logout trigger and guest login CTA.
 *
 * `deskHref` replaces that trigger with the way back to the moderation desk. A moderator who came
 * over from `/admin` to read a story as a citizen is stuck here otherwise: every button on this
 * page returns to the citizen board, and typing the desk address by hand is not a way out. Their
 * logout is not lost — the desk rail has it.
 */
export function NavbarAccount({
  account,
  deskHref,
}: {
  account?: AccountProps | null;
  deskHref?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Proceed with client sign out even if backend session revoke returns an error
    }
    await createClient().auth.signOut();
    router.replace("/");
    return true;
  };

  if (!account) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-normal text-slate-800 transition-all hover:border-slate-900 hover:bg-slate-50"
      >
        Masuk
      </Link>
    );
  }

  const displayName = account.name || account.email?.split("@")[0] || "Akun";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-1.5 pr-2.5 shadow-2xs transition-colors hover:border-slate-300">
      {/* Avatar Image or Initial */}
      {account.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={account.avatarUrl}
          alt=""
          width={24}
          height={24}
          referrerPolicy="no-referrer"
          className="h-6 w-6 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-[10px] font-medium text-white"
          aria-hidden="true"
        >
          {initial}
        </span>
      )}

      {/* Account Label */}
      <span
        className="hidden max-w-[120px] truncate text-xs font-normal text-slate-700 sm:block"
        title={account.email ?? undefined}
      >
        {displayName}
      </span>

      {/* Subtle Separator */}
      <span className="hidden sm:block h-3.5 w-px bg-slate-200" aria-hidden="true" />

      {/* Integrated Logout Icon Action, or the desk's way home for somebody who has one */}
      {deskHref ? (
        <Link
          href={deskHref}
          title="Kembali ke meja moderasi"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100/70 hover:text-slate-900"
        >
          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Kembali ke meja moderasi</span>
        </Link>
      ) : (
        <ConfirmButton
          onConfirm={handleLogout}
          triggerTitle="Keluar dari akun"
          triggerClassName="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-full hover:bg-red-50/50"
          label={
            <>
              <Icon icon="solar:logout-2-bold-duotone" className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Keluar dari akun</span>
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
      )}
    </div>
  );
}

