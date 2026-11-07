import type { ReactNode } from "react";
import { Navbar, type Account } from "@/components/navbar/Navbar";

/**
 * Shell frame wrapping the community stories board with universal navbar and footer.
 */
export function CommunityShell({
  account,
  children,
}: {
  account?: Account;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <div className="w-full bg-white border-b border-slate-100 pb-3">
        <Navbar account={account} />
      </div>

      <main className="w-full flex-1">{children}</main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform • Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600 font-normal">
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
