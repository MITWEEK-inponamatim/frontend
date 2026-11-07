"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";

export type AccountProps = {
  email?: string;
  avatarUrl?: string | null;
  name?: string | null;
};

/**
 * Account badge with embedded compact logout trigger and guest login CTA.
 */
export function NavbarAccount({ account }: { account?: AccountProps | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Proceed with client sign out even if backend session revoke returns an error
    }
    await createClient().auth.signOut();
    router.replace("/");
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

      {/* Integrated Logout Icon Action */}
      <button
        type="button"
        onClick={handleLogout}
        title="Keluar dari akun"
        aria-label="Keluar dari akun"
        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-full hover:bg-red-50/50"
      >
        <Icon icon="solar:logout-2-bold-duotone" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

