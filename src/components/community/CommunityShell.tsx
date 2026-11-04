import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { Account } from "@/components/navbar/Navbar";

const ICON_BUTTON =
  "grid h-11 w-11 place-items-center rounded-full text-pos-ink transition-colors hover:bg-pos-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";

/**
 * The frame around the community board.
 *
 * Deliberately not SiteShell: the landing page is looked at, this page is read, so the board gets a
 * white bar, a hairline, a system typeface and a 470px measure instead of a hero. Nothing here is
 * shared with the marketing pages — the header is 60px tall because the board's sticky rail and
 * bottom bar are measured from it.
 */
export function CommunityShell({ account, children }: { account?: Account; children: ReactNode }) {
  const initial = (account?.name ?? account?.email ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-pos-shell font-pos-ui text-pos-ink">
      <header className="sticky top-0 z-40 border-b border-pos-line bg-pos-card">
        <div className="mx-auto flex h-[60px] w-full max-w-[1012px] items-center gap-4 px-4 sm:px-6">
          <Link href="/community/latest" className="rounded-full px-1 text-[17px] font-semibold tracking-tight text-pos-ink">
            Papan Warga
          </Link>

          <nav aria-label="Akun" className="ml-auto flex items-center gap-1">
            <Link href="/recognize" className={ICON_BUTTON} aria-label="Pindai nomor">
              <Icon icon="solar:magnifier-linear" className="h-6 w-6" />
            </Link>

            {account && (
              <>
                <span className="hidden max-w-[11rem] truncate pr-1 text-[13px] text-pos-muted md:block" title={account.email}>
                  {account.email}
                </span>
                <span className="hidden h-6 w-px bg-pos-line md:block" aria-hidden="true" />
                {account.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote Google avatar, sized and non-interactive
                  <img src={account.avatarUrl} alt="" width={32} height={32} referrerPolicy="no-referrer" className="ml-1 h-8 w-8 shrink-0 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-pos-line text-[12px] font-semibold text-pos-muted">
                    {initial}
                  </span>
                )}
                <LogoutButton className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-pos-ink/70 transition-colors hover:bg-pos-ink/5 hover:text-pos-ink" />
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="w-full">{children}</main>
    </div>
  );
}
