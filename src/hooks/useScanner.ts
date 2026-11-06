"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { canonicalPhone, isPlausibleIndonesianNumber } from "@/lib/phone";

export type ScanTab = "url" | "phone" | "application";
export type CommunityReview = { id: string; category: string; status: string; age_days: number | null; evidence_url?: string | null };
export type ScanResult = { outcome: string; risk: { level: string; confidence: string; coverage?: { summary?: string; checks_run?: string[]; checks_unavailable?: string[] } }; findings: { id: string; indicator: string; severity: string }[]; evidence_summary: string; recommended_actions: string[]; limitations: string[]; artifacts?: { community_reviews?: CommunityReview[]; community_review_count?: number }; error?: { code: string; message: string } | null };

const ERROR_MESSAGES: Record<string, string> = {
  invalid_request: "Permintaan tidak valid. Muat ulang halaman lalu coba lagi.",
  invalid_input: "Masukkan data yang ingin dipindai.",
  invalid_url: "Tautan tidak valid. Gunakan alamat lengkap yang diawali http:// atau https://.",
  invalid_phone: "Nomor tidak dapat dikenali sebagai nomor telepon.",
  not_indonesian: "Layanan ini hanya menerima nomor Indonesia (+62).",
  file_required: "Pilih berkas terlebih dahulu.",
  file_too_large: "Berkas melebihi batas ukuran. Berkas APK maksimal 50 MB.",
  unsupported_file_type: "Format berkas tidak didukung. Gunakan berkas .apk.",
  rate_limited: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
  duplicate_report: "Anda sudah pernah melaporkan nomor ini. Satu akun hanya bisa melapor sekali per nomor.",
  invalid_category: "Kategori laporan tidak dikenal. Pilih salah satu kategori yang tersedia.",
  invalid_note: "Catatan terlalu panjang. Maksimal 280 karakter.",
  evidence_required: "Lampiran bukti gambar wajib diisi sebelum laporan dikirim.",
  evidence_too_large: "Gambar bukti melebihi batas ukuran. Kompres dulu lalu kirim lagi.",
  evidence_unsupported_type: "Bukti harus berupa gambar (JPG, PNG, WEBP, atau HEIC dari kamera ponsel).",
  evidence_unavailable: "Bukti gambar tidak dapat disimpan, jadi laporan tidak dikirim. Coba lagi sebentar lagi.",
  storage_unavailable: "Berkas gagal disimpan sementara. Coba lagi sebentar lagi.",
  service_unavailable: "Layanan sedang tidak tersedia. Coba lagi nanti.",
  unauthenticated: "Sesi tidak valid. Silakan masuk kembali.",
  session_required: "Sesi belum diverifikasi. Silakan masuk kembali.",
  session_expired_idle: "Sesi berakhir karena tidak ada aktivitas. Silakan masuk kembali.",
  session_expired_absolute: "Sesi berakhir. Silakan masuk kembali.",
  not_found: "Scan tidak ditemukan.",
  request_failed: "Scan tidak dapat dikirim. Periksa koneksi lalu coba lagi.",
};

export function messageForError(code: string | undefined | null): string {
  if (!code) return ERROR_MESSAGES.request_failed;
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.request_failed;
}

export function useScanner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScanTab>("url"); const [input, setInput] = useState(""); const [number, setNumber] = useState(""); const [file, setFile] = useState<File | null>(null); const [consent, setConsent] = useState(false);
  const [isScanning, setIsScanning] = useState(false); const [scanStep, setScanStep] = useState(""); const [errorMessage, setErrorMessage] = useState<string | null>(null); const [result, setResult] = useState<ScanResult | null>(null);
  const [scanId, setScanId] = useState("");
  // Which kind of check the current scanId belongs to. A ref because the poll reads it once, when
  // the verdict arrives, and nothing on screen is derived from it.
  const runningKind = useRef<ScanTab>("url");
  const resetScan = useCallback(() => { setResult(null); setErrorMessage(null); setScanId(""); setIsScanning(false); setScanStep(""); }, []);
  useEffect(() => {
    if (!scanId) return;
    let live = true;
    const poll = async () => {
      try {
        const response = await api(`/api/v1/scans/${scanId}`, { headers: { "X-Activity": "passive" } });
        if (!live) return;
        if (response.status === "completed" || response.status === "failed") {
          setResult(response.report); setIsScanning(false); setScanStep(""); setScanId("");
          // A finished link or APK check moves to its own address, which is what the history list
          // then points at. The phone verdict keeps going to its number page instead.
          if (runningKind.current === "url") router.push(`/recognize/url/${scanId}`);
          if (runningKind.current === "application") router.push(`/recognize/apk/${scanId}`);
          return;
        }
        setScanStep("Menganalisis bukti..."); setTimeout(poll, 2000);
      } catch (error) {
        if (!live) return;
        setErrorMessage(messageForError(error instanceof Error ? error.message : null)); setIsScanning(false); setScanId(""); setScanStep("");
      }
    };
    const timer = setTimeout(poll, 1000);
    return () => { live = false; clearTimeout(timer); };
  }, [scanId, router]);
  const submit = useCallback(async (tab: ScanTab, value: string) => {
    setErrorMessage(null); setResult(null);
    if (tab === "url" && !value.trim()) { setErrorMessage("Masukkan tautan yang ingin dipindai."); return; }
    if (tab === "phone") {
      if (!value.trim()) { setErrorMessage("Masukkan nomor telepon."); return; }
      if (!canonicalPhone(value)) { setErrorMessage("Layanan ini hanya menerima nomor Indonesia (+62)."); return; }
      if (!isPlausibleIndonesianNumber(value)) { setErrorMessage("Nomor Indonesia membutuhkan 9–12 digit setelah +62, misalnya 081234567890."); return; }
    }
    if (tab === "application" && !file) { setErrorMessage("Pilih berkas terlebih dahulu."); return; }
    setIsScanning(true); setScanStep("Mengirim scan..."); runningKind.current = tab;
    try {
      let response;
      // The phone body is the canonical +62 form, not what was typed, so 0812… and +62 0812…
      // reach the scanner as the same search key.
      if (tab === "url") response = await api("/api/v1/scans/url", { method: "POST", body: JSON.stringify({ url: value }) });
      else if (tab === "phone") response = await api("/api/v1/scans/phone", { method: "POST", body: JSON.stringify({ number: canonicalPhone(value), default_region: "ID" }) });
      else { const body = new FormData(); body.set("file", file!); body.set("consent_external_upload", String(consent)); response = await api("/api/v1/scans/application", { method: "POST", body }); }
      setScanId(response.scan_id);
      setScanStep(tab === "application" ? "Mengunggah berkas dan menganalisis..." : "Mengantrekan scan...");
    } catch (error) {
      setErrorMessage(messageForError(error instanceof Error ? error.message : null)); setIsScanning(false); setScanStep("");
    }
  }, [file, consent]);
  // The phone tab scans but never shows its own answer: the verdict belongs at
  // /recognize/phone/[nomor], so the search box navigates once this resolves. startPhoneScan is
  // how both that box and the result page kick it off.
  const runScan = useCallback(() => submit(activeTab, input), [submit, activeTab, input]);
  const startPhoneScan = useCallback((value: string) => { setNumber(value); void submit("phone", value); }, [submit]);
  return { activeTab, setActiveTab, input, setInput, number, setNumber, file, setFile, consent, setConsent, isScanning, scanStep, errorMessage, result, runScan, startPhoneScan, resetScan };
}
