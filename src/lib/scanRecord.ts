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

// A stored APK check is filed as "<akun>/<scan>/<nama berkas>", so the last segment is the only
// part a person recognises. A link is stored exactly as it was typed and shown the same way.
export function scanTargetLabel(type: string, ref: string | null | undefined) {
  if (!ref) return "";
  if (type !== "application") return ref;
  const segments = ref.split("/");
  return segments[segments.length - 1] ?? "";
}

export function isScanFinished(status: string) {
  return status === "completed" || status === "failed";
}

const OUTCOME_LABELS: Record<string, string> = {
  confirmed_threat: "Ancaman terkonfirmasi",
  suspicious: "Mencurigakan",
  scan_failed: "Scan gagal",
};

// The verdict word, used by the result page and the history list alike: a check that decided
// neither a threat nor a suspicion is described by what it still lacks.
export function scanOutcomeLabel(outcome: string | null | undefined) {
  return OUTCOME_LABELS[outcome ?? ""] ?? "Bukti belum cukup";
}
