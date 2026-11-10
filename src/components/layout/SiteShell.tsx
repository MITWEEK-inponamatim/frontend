import type { ReactNode } from "react";
import { Navbar, type Account } from "@/components/navbar/Navbar";
import { SideOrnaments } from "@/components/hero/SideOrnaments";
import { HeroSection } from "@/components/hero/HeroSection";
import { ThreatsSection } from "@/components/threats/ThreatsSection";
import { WarningSection } from "@/components/warning/WarningSection";

/**
 * Shared page shell so `/`, `/recognize`, and the number pages stay visually identical.
 *
 * Two sanctioned differences: `account` adds the profile photo and logout button to the navbar,
 * and `scanner` replaces the scan card in the hero (used by /recognize/phone/[nomor], where the
 * card shows one number instead of an empty form). The community board is not in here on purpose:
 * it is read like a noticeboard, not looked at like a landing page, so it lives in
 * components/community/CommunityShell.tsx with its own type and palette. Anything else that
 * diverges here diverts the pages over time, so keep layout changes in this component.
 */
export function SiteShell({
  account = null,
  scanner = null,
  showEducationalSections = true,
  children = null,
}: {
  account?: Account | null;
  scanner?: ReactNode;
  showEducationalSections?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-white text-slate-900 flex flex-col justify-between">
      <Navbar account={account} />

      {/* Hero viewport with dedicated side ornaments */}
      <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between">
        <SideOrnaments />
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <HeroSection scanner={scanner} hideCategoryTags={!showEducationalSections}>
            {children}
          </HeroSection>
        </div>
      </div>

      {/* Content sections under the hero (Shown on public landing page) */}
      {showEducationalSections && (
        <main className="relative z-10 w-full bg-white">
          <ThreatsSection />
          <WarningSection />
        </main>
      )}

      {/* Minimal footer */}
      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform • Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Recognize</span>
            <span>•</span>
            <span>Learn</span>
            <span>•</span>
            <span>Act</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
