import React from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { LandingInteractionGuard } from "@/components/auth/LandingInteractionGuard";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Public landing page introducing ThreatLens capabilities, threats, and warning toasts.
 */
async function HomeContent() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  const account = user
    ? {
        email: user.email ?? undefined,
        avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
        name: metadata.full_name ?? metadata.name ?? null,
      }
    : null;

  return (
    <>
      <LandingInteractionGuard authenticated={!!user} />
      <SiteShell account={account} />
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}
    >
      <HomeContent />
    </Suspense>
  );
}
