import type { Metadata } from "next";

/**
 * Nothing under /admin is meant to be indexed: it is a work surface behind a login. The shell that
 * holds the rail and the search field lives in the (desk) group, because the sign-in page under this
 * same prefix must render without one.
 */
export const metadata: Metadata = {
  title: {
    default: "Panel Moderasi",
    template: "%s | ThreatLens",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
