"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export type ScanTab = "url" | "message" | "phone" | "application" | "image";
export type ScanResult = { outcome: string; risk: { level: string; confidence: string; coverage?: { summary?: string; checks_run?: string[]; checks_unavailable?: string[] } }; findings: { id: string; indicator: string; severity: string }[]; evidence_summary: string; recommended_actions: string[]; limitations: string[]; error?: { code: string; message: string } | null };

const ERROR_MESSAGES: Record<string, string> = {
  invalid_request: "Permintaan tidak valid. Muat ulang halaman lalu coba lagi.",
  invalid_input: "Masukkan data yang ingin dipindai.",
  invalid_url: "Tautan tidak valid. Gunakan alamat lengkap yang diawali http:// atau https://.",
  invalid_phone: "Nomor telepon tidak valid. Periksa kode negara dan jumlah digit.",
  file_required: "Pilih berkas terlebih dahulu.",
  file_too_large: "Berkas melebihi batas ukuran. Tangkapan layar maksimal 15 MB, APK maksimal 50 MB.",
  unsupported_file_type: "Format berkas tidak didukung. Gunakan PNG/JPG/WEBP untuk gambar atau berkas .apk untuk aplikasi.",
  rate_limited: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
  duplicate_report: "Anda sudah pernah melaporkan nomor ini. Satu akun hanya bisa melapor sekali per nomor.",
  invalid_category: "Kategori laporan tidak dikenal. Pilih salah satu kategori yang tersedia.",
  invalid_note: "Catatan terlalu panjang. Maksimal 280 karakter.",
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

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function useScanner() {
  const [activeTab, setActiveTab] = useState<ScanTab>("url"); const [input, setInput] = useState(""); const [number, setNumber] = useState(""); const [region, setRegion] = useState("ID"); const [file, setFile] = useState<File | null>(null); const [consent, setConsent] = useState(false);
  const [isScanning, setIsScanning] = useState(false); const [scanStep, setScanStep] = useState(""); const [errorMessage, setErrorMessage] = useState<string | null>(null); const [result, setResult] = useState<ScanResult | null>(null);
  const [scanId, setScanId] = useState("");
  const resetScan = useCallback(() => { setResult(null); setErrorMessage(null); setScanId(""); setIsScanning(false); setScanStep(""); }, []);
  useEffect(() => {
    if (!scanId) return;
    let live = true;
    const poll = async () => {
      try {
        const response = await api(`/api/v1/scans/${scanId}`, { headers: { "X-Activity": "passive" } });
        if (!live) return;
        if (response.status === "completed" || response.status === "failed") { setResult(response.report); setIsScanning(false); setScanStep(""); setScanId(""); return; }
        setScanStep("Menganalisis bukti..."); setTimeout(poll, 2000);
      } catch (error) {
        if (!live) return;
        setErrorMessage(messageForError(error instanceof Error ? error.message : null)); setIsScanning(false); setScanId(""); setScanStep("");
      }
    };
    const timer = setTimeout(poll, 1000);
    return () => { live = false; clearTimeout(timer); };
  }, [scanId]);
  const runScan = useCallback(async () => {
    setErrorMessage(null); setResult(null);
    if ((activeTab === "url" || activeTab === "message") && !input.trim()) { setErrorMessage("Masukkan data yang ingin dipindai."); return; }
    if (activeTab === "phone") {
      if (!number.trim()) { setErrorMessage("Masukkan nomor telepon."); return; }
      const digits = digitsOnly(number);
      if (digits.length < 7 || digits.length > 15) { setErrorMessage("Nomor telepon tidak valid. Gunakan 7–15 digit."); return; }
    }
    if ((activeTab === "application" || activeTab === "image") && !file) { setErrorMessage("Pilih berkas terlebih dahulu."); return; }
    setIsScanning(true); setScanStep("Mengirim scan...");
    try {
      let response;
      if (activeTab === "url") response = await api("/api/v1/scans/url", { method: "POST", body: JSON.stringify({ url: input }) });
      else if (activeTab === "message") response = await api("/api/v1/scans/message", { method: "POST", body: JSON.stringify({ text: input }) });
      else if (activeTab === "phone") response = await api("/api/v1/scans/phone", { method: "POST", body: JSON.stringify({ number, default_region: region }) });
      else { const body = new FormData(); body.set("file", file!); if (activeTab === "application") body.set("consent_external_upload", String(consent)); response = await api(`/api/v1/scans/${activeTab}`, { method: "POST", body }); }
      setScanId(response.scan_id);
      setScanStep(activeTab === "application" ? "Mengunggah berkas dan menganalisis..." : "Mengantrekan scan...");
    } catch (error) {
      setErrorMessage(messageForError(error instanceof Error ? error.message : null)); setIsScanning(false); setScanStep("");
    }
  }, [activeTab, input, number, region, file, consent]);
  return { activeTab, setActiveTab, input, setInput, number, setNumber, region, setRegion, file, setFile, consent, setConsent, isScanning, scanStep, errorMessage, result, runScan, resetScan };
}
