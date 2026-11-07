import { canonicalPhone, formatDisplayPhone } from "@/lib/phone";

/**
 * Reading a stored scan back: what it was about, and what it is called on screen.
 *
 * The history list and the per-check pages both describe the same rows, so the wording and the
 * icon live in one place — the two surfaces drifting apart is exactly what makes a list unreadable.
 */
export const SCAN_KIND_META: Record<string, { label: string; icon: string }> = {
  url: { label: "Tautan", icon: "solar:link-circle-bold-duotone" },
  application: { label: "Berkas APK", icon: "solar:document-bold-duotone" },
  phone: { label: "Nomor", icon: "solar:phone-bold-duotone" },
};

export function scanKindLabel(type: string) {
  return SCAN_KIND_META[type]?.label ?? "Pemeriksaan";
}

/**
 * Formats a scan input reference into a human-readable display label.
 *
 * @param type - Scan kind ("url", "application", or "phone").
 * @param ref - Raw reference string from the database.
 */
export function scanTargetLabel(type: string, ref: string | null | undefined) {
  if (!ref) return "";
  if (type === "application") {
    const segments = ref.split("/");
    return segments[segments.length - 1] ?? "";
  }
  if (type === "phone") {
    return formatDisplayPhone(ref) || canonicalPhone(ref) || ref;
  }
  return ref;
}

export function isScanFinished(status: string) {
  return status === "completed" || status === "failed";
}

const OUTCOME_LABELS: Record<string, string> = {
  confirmed_threat: "Ancaman terkonfirmasi",
  suspicious: "Mencurigakan",
  scan_failed: "Scan gagal",
};

/**
 * Returns human-friendly text label for a scan outcome.
 *
 * @param outcome - Stored scan outcome string.
 */
export function scanOutcomeLabel(outcome: string | null | undefined) {
  return OUTCOME_LABELS[outcome ?? ""] ?? "Bukti belum cukup";
}
