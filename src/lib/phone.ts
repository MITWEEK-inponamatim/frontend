// Indonesian subscriber digits, with the trunk 0 dropped when it follows the country code.
// 0812…, 62812… and +62 0812… are one and the same number, and a report stored under one
// spelling must not become invisible to a search using another. Returns "" for anything that
// does not resolve to a +62 number, which is the whole product scope.
export function subscriberDigits(value: string) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("62")) {
    const subscriber = digits.slice(2);
    return subscriber.startsWith("0") ? subscriber.slice(1) : subscriber;
  }
  if ((value || "").trim().startsWith("+")) return "";
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

// The number as it is sent to the API: unambiguous regardless of how it was typed.
export function canonicalPhone(value: string) {
  const subscriber = subscriberDigits(value);
  return subscriber ? `+62${subscriber}` : "";
}

/**
 * Formats an Indonesian phone number into standard chunked display: +62 8xx-xxxx-xxxx
 *
 * @param value - Raw or canonical phone number string.
 */
export function formatDisplayPhone(value: string) {
  const canon = canonicalPhone(value);
  if (!canon) return value;
  const subscriber = subscriberDigits(value);
  if (!subscriber) return canon;
  if (subscriber.length >= 9) {
    const prefix = subscriber.slice(0, 3);
    const mid = subscriber.slice(3, 7);
    const rest = subscriber.slice(7);
    return `+62 ${prefix}-${mid}-${rest}`;
  }
  return canon;
}

// The number as it appears in a URL segment: no "+" (which would be percent-encoded) and no
// separators, so /recognize/phone/6281234567890 is the one canonical address for a number.
export function phoneSlug(value: string) {
  const subscriber = subscriberDigits(value);
  return subscriber ? `62${subscriber}` : "";
}

export function isPlausibleIndonesianNumber(value: string) {
  const subscriber = subscriberDigits(value);
  return subscriber.length >= 9 && subscriber.length <= 12;
}

// The one place the "is this number worth searching?" wording lives, so the scan form and the
// number page cannot answer the same typo with two different sentences. Returns "" when usable.
export function phoneInputProblem(value: string) {
  if (!value.trim()) return "Masukkan nomor telepon.";
  if (!canonicalPhone(value)) return "Layanan ini hanya menerima nomor Indonesia (+62).";
  if (!isPlausibleIndonesianNumber(value)) return "Nomor Indonesia membutuhkan 9–12 digit setelah +62, misalnya 081234567890.";
  return "";
}
