import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { PhoneNumberResult } from "@/components/recognize/PhoneNumberResult";
import { createClient } from "@/lib/supabase/server";
import { phoneSlug } from "@/lib/phone";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * One number, one address.
 *
 * 0812…, +62 812… and 62 0812… are the same subscriber, so any spelling that reaches this URL is
 * redirected to its canonical slug. Without that, a report filed under one spelling would be
 * invisible to a search typed in another.
 */
async function RecognizePhoneContent({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const canonical = phoneSlug(number);
  if (!canonical) redirect("/recognize");
  if (canonical !== number) redirect(`/recognize/phone/${canonical}`);
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <>
      <IdleSessionMonitor />
      <SiteShell
        account={{ email: user?.email ?? undefined, avatarUrl: metadata.avatar_url ?? metadata.picture ?? null, name: metadata.full_name ?? metadata.name ?? null }}
        scanner={<PhoneNumberResult slug={canonical} />}
      />
    </>
  );
}

// The params promise is awaited inside the Suspense boundary: with Cache Components on, reading
// them in the page body would block prerendering of the whole route.
export default function RecognizePhonePage({ params }: { params: Promise<{ number: string }> }) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}>
      <RecognizePhoneContent params={params} />
    </Suspense>
  );
}
