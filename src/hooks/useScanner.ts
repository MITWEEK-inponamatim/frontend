"use client";

import { useState, useCallback } from "react";

export type ScanTab = "text" | "file" | "image";

export interface ScanResult {
  status: "safe" | "suspicious" | "high_risk";
  threatScore: number; // 0 - 100
  title: string;
  summary: string;
  details: string[];
  recommendation: string;
}

export function useScanner() {
  const [activeTab, setActiveTab] = useState<ScanTab>("text");
  
  // Inputs
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleTextChange = useCallback((value: string) => {
    setTextContent(value);
    if (errorMessage) setErrorMessage(null);
  }, [errorMessage]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Limit 50MB
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("Ukuran file melebihi batas maksimum 50MB.");
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
  }, []);

  const handleImageSelect = useCallback((file: File | null) => {
    if (!file) {
      setSelectedImage(null);
      setImagePreviewUrl(null);
      return;
    }

    // Limit 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar melebihi batas maksimum 15MB.");
      return;
    }

    setSelectedImage(file);
    setErrorMessage(null);

    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  }, []);

  const resetScan = useCallback(() => {
    setResult(null);
    setErrorMessage(null);
    setIsScanning(false);
    setScanStep("");
  }, []);

  const clearCurrentInput = useCallback(() => {
    if (activeTab === "text") {
      setTextContent("");
    } else if (activeTab === "file") {
      setSelectedFile(null);
    } else if (activeTab === "image") {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
    setErrorMessage(null);
    setResult(null);
  }, [activeTab, imagePreviewUrl]);

  const runScan = useCallback(async () => {
    setErrorMessage(null);
    setResult(null);

    // Validation
    if (activeTab === "text" && !textContent.trim()) {
      setErrorMessage("Silakan tempel tautan (URL), nomor telepon, atau pesan teks yang ingin diperiksa.");
      return;
    }

    if (activeTab === "file" && !selectedFile) {
      setErrorMessage("Silakan unggah file dokumen atau installer APK terlebih dahulu.");
      return;
    }

    if (activeTab === "image" && !selectedImage) {
      setErrorMessage("Silakan pilih atau seret bukti tangkapan layar (screenshot) ke area unggah.");
      return;
    }

    // Start Scanning Simulation
    setIsScanning(true);
    setScanStep("Mengekstraksi metadata & tanda digital...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanStep("Memeriksa basis data ancaman & blacklist AI...");

      await new Promise((resolve) => setTimeout(resolve, 900));
      setScanStep("Menganalisis pola rekayasa sosial & heuristik...");

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Generate context-aware mock result
      if (activeTab === "text") {
        const lower = textContent.toLowerCase();
        if (lower.includes("bit.ly") || lower.includes("undian") || lower.includes("hadiah") || lower.includes("login") || lower.includes("bank")) {
          setResult({
            status: "high_risk",
            threatScore: 94,
            title: "Terdeteksi Indikasi Kuat Phishing Scam",
            summary: "Tautan atau teks mengandung pola rekayasa sosial manipulatif yang memalsukan institusi resmi.",
            details: [
              "Menggunakan pemendek tautan untuk menyamarkan alamat server tujuan.",
              "Domain server tidak terdaftar dalam sertifikat perbankan/resmi.",
              "Pola kalimat mendesak korban untuk menyerahkan kredensial OTP/PIN.",
            ],
            recommendation: "JANGAN klik tautan atau berikan informasi sensitif apa pun. Segera blokir kontak pengirim.",
          });
        } else {
          setResult({
            status: "safe",
            threatScore: 8,
            title: "Tidak Ditemukan Pola Ancaman Dikenal",
            summary: "Teks atau URL yang dimasukkan memiliki reputasi domain yang valid dan tidak terdapat ancaman aktif.",
            details: [
              "Domain memiliki reputasi SSL terpercaya.",
              "Tidak ditemukan dalam daftar hitam (blacklist) penipuan nasional.",
            ],
            recommendation: "Tetap waspada dan jangan pernah membagikan kata sandi atau kode OTP kepada pihak mana pun.",
          });
        }
      } else if (activeTab === "file") {
        const fileName = selectedFile?.name.toLowerCase() || "";
        if (fileName.endsWith(".apk") || fileName.includes("surat") || fileName.includes("paket")) {
          setResult({
            status: "high_risk",
            threatScore: 98,
            title: "Malware / Trojan APK Berbahaya Terdeteksi",
            summary: `File "${selectedFile?.name}" teridentifikasi sebagai spyware penyadap SMS/OTP perbankan.`,
            details: [
              "Izin akses berbahaya: READ_SMS, RECEIVE_SMS, ACCESSIBILITY_SERVICE.",
              "Berusaha mencuri notifikasi bank secara diam-diam di latar belakang.",
              "Tanda tangan digital tidak bersumber dari Google Play Store resmi.",
            ],
            recommendation: "JANGAN INSTALL file ini pada perangkat Android Anda! Segera hapus file installer dari penyimpanan.",
          });
        } else {
          setResult({
            status: "safe",
            threatScore: 5,
            title: "File Bersih Tanpa Malware",
            summary: `Tidak ditemukan payload berbahaya pada file "${selectedFile?.name}".`,
            details: [
              "Struktur file sesuai dengan format standar dan aman dibuka.",
              "Tidak terdapat script eksekusi tersembunyi.",
            ],
            recommendation: "File aman untuk diarsipkan.",
          });
        }
      } else if (activeTab === "image") {
        setResult({
          status: "suspicious",
          threatScore: 78,
          title: "Terdeteksi Bukti Transfer / Chat Manipulatif",
          summary: "AI mendeteksi anomali font dan tata letak bukti mutasi yang tidak lazim pada tangkapan layar.",
          details: [
            "Piksel font pada bagian nominal transfer terindikasi hasil suntingan gambar.",
            "Nomor referensi transaksi tidak sinkron dengan format standar perbankan.",
          ],
          recommendation: "Cek langsung mutasi pada rekening/aplikasi bank resmi Anda sebelum mengirimkan barang atau memproses pesanan.",
        });
      }
    } catch {
      setErrorMessage("Terjadi kendala saat menganalisis. Silakan coba kembali.");
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  }, [activeTab, textContent, selectedFile, selectedImage]);

  return {
    activeTab,
    setActiveTab,
    textContent,
    handleTextChange,
    selectedFile,
    handleFileSelect,
    selectedImage,
    imagePreviewUrl,
    handleImageSelect,
    isScanning,
    scanStep,
    errorMessage,
    result,
    runScan,
    resetScan,
    clearCurrentInput,
  };
}
