/**
 * Kelas bantu yang dipakai komponen UI. Sengaja tidak memakai `clsx`/`tailwind-merge`: satu-satunya
 * yang dibutuhkan di sini adalah menggabungkan string dan melewati `false`/`undefined`.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter((part) => Boolean(part)).join(" ");
}
