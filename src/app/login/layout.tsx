import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

/**
 * Route layout providing metadata title for user authentication.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

