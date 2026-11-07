"use client";

import { Icon } from "@/components/ui/Icon";

const SENSITIVE_PERMISSION_DESCRIPTIONS: Record<string, string> = {
  "android.permission.RECEIVE_SMS": "Menyadap dan menerima SMS verifikasi OTP perbankan secara background",
  "android.permission.READ_SMS": "Membaca isi seluruh pesan SMS masuk dan riwayat pesan",
  "android.permission.SEND_SMS": "Mengirim SMS berbayar atau meneruskan data sadapan tanpa izin pengguna",
  "android.permission.BIND_ACCESSIBILITY_SERVICE": "Mengambil alih kendali layar sentuh dan membaca ketukan keyboard (Keylogger)",
  "android.permission.SYSTEM_ALERT_WINDOW": "Menampilkan jendela pop-up palsu di atas aplikasi perbankan asli (Overlay Attack)",
  "android.permission.REQUEST_INSTALL_PACKAGES": "Memasang berkas APK berbahaya lainnya secara diam-diam (Dropper)",
  "android.permission.READ_CONTACTS": "Mengakses seluruh daftar kontak untuk pemerasan atau spam berantai",
  "android.permission.CAMERA": "Mengakses kamera secara diam-diam",
  "android.permission.RECORD_AUDIO": "Merekam suara sekitar melalui mikrofon",
};

/**
 * Renders categorized Android APK permissions in an authentic Apple Inset Grouped format,
 * highlighting sensitive sniffer and accessibility privileges.
 *
 * @param permissions - Array of Android permissions extracted by Androguard worker.
 */
export function ApkPermissionsViewer({
  permissions,
}: {
  permissions?: string[];
}) {
  if (!permissions || permissions.length === 0) return null;

  const sensitive = permissions.filter(
    (p) => p in SENSITIVE_PERMISSION_DESCRIPTIONS,
  );
  const standard = permissions.filter(
    (p) => !(p in SENSITIVE_PERMISSION_DESCRIPTIONS),
  );

  return (
    <div className="space-y-3">
      {/* 1. Sensitive / Dangerous Permissions Group */}
      {sensitive.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-normal text-[#FF3B30]">
            <span className="flex items-center gap-1.5">
              <Icon icon="solar:danger-triangle-linear" className="h-3.5 w-3.5" />
              <span>Izin akses sensitif ({sensitive.length}):</span>
            </span>
            <span className="text-xs">Risiko tinggi</span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs divide-y divide-slate-100">
            {sensitive.map((perm) => (
              <div key={perm} className="p-3 text-xs font-normal">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-900 truncate">
                    {perm.replace("android.permission.", "")}
                  </span>
                  <span className="shrink-0 text-xs text-[#FF3B30]">
                    Kritis
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {SENSITIVE_PERMISSION_DESCRIPTIONS[perm]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Standard Permissions Group */}
      {standard.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-normal text-slate-500">
            Izin standar aplikasi ({standard.length}):
          </span>

          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-2xs divide-y divide-slate-100">
            {standard.map((perm) => (
              <div key={perm} className="flex items-center justify-between p-2.5 text-xs font-normal">
                <span className="font-mono text-xs text-slate-700 truncate">
                  {perm.replace("android.permission.", "")}
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  Standar
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

