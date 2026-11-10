import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Komunitas & Diskusi",
    template: "%s | ThreatLens",
  },
};

/**
 * Route layout providing metadata title for community discussions and reports.
 */
export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
