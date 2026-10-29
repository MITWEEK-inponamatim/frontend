"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useScanner, ScanTab } from "@/hooks/useScanner";

export function RecognizeCard() {
  const {
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
  } = useScanner();

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleTabSwitch = (tab: ScanTab) => {
    if (isScanning) return;
    setActiveTab(tab);
    resetScan();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* 1. Pill Tabs Navigation (Persis layout di atas prompt bar SphereAI) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => handleTabSwitch("text")}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
            activeTab === "text"
              ? "bg-slate-900 text-white shadow-sm border border-slate-900 font-medium"
              : "bg-white text-slate-600 border border-gray-200/90 hover:border-gray-300 hover:text-slate-900 font-normal"
          }`}
        >
          <Icon icon="solar:link-circle-bold-duotone" className="w-3.5 h-3.5 opacity-80" />
          <span>Tautan & Pesan</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch("file")}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
            activeTab === "file"
              ? "bg-slate-900 text-white shadow-sm border border-slate-900 font-medium"
              : "bg-white text-slate-600 border border-gray-200/90 hover:border-gray-300 hover:text-slate-900 font-normal"
          }`}
        >
          <Icon icon="solar:document-bold-duotone" className="w-3.5 h-3.5 opacity-80" />
          <span>Berkas APK</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch("image")}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
            activeTab === "image"
              ? "bg-slate-900 text-white shadow-sm border border-slate-900 font-medium"
              : "bg-white text-slate-600 border border-gray-200/90 hover:border-gray-300 hover:text-slate-900 font-normal"
          }`}
        >
          <Icon icon="solar:gallery-wide-bold-duotone" className="w-3.5 h-3.5 opacity-80" />
          <span>Tangkapan Layar</span>
        </button>
      </div>

      {/* 2. Unified Input Box / Prompt Bar Container */}
      <div className="w-full bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 relative">
        
        {/* RESULT STATE */}
        {result ? (
          <div className="animate-in fade-in duration-150">
            <div
              className={`border rounded-2xl p-4 sm:p-5 ${
                result.status === "high_risk"
                  ? "bg-red-50/50 border-red-200 text-red-950"
                  : result.status === "suspicious"
                  ? "bg-amber-50/50 border-amber-200 text-amber-950"
                  : "bg-emerald-50/50 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-2 rounded-xl text-white ${
                      result.status === "high_risk"
                        ? "bg-red-600"
                        : result.status === "suspicious"
                        ? "bg-amber-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    <Icon
                      icon={
                        result.status === "high_risk"
                          ? "solar:shield-warning-bold-duotone"
                          : result.status === "suspicious"
                          ? "solar:danger-triangle-bold-duotone"
                          : "solar:shield-check-bold-duotone"
                      }
                      className="w-5 h-5"
                    />
                  </span>
                  <div>
                    <span
                      className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-medium ${
                        result.status === "high_risk"
                          ? "bg-red-200/70 text-red-800"
                          : result.status === "suspicious"
                          ? "bg-amber-200/70 text-amber-800"
                          : "bg-emerald-200/70 text-emerald-800"
                      }`}
                    >
                      {result.status === "high_risk"
                        ? "Bahaya Tinggi"
                        : result.status === "suspicious"
                        ? "Mencurigakan"
                        : "Terverifikasi Aman"}
                    </span>
                    <h4 className="text-base font-normal text-slate-900 mt-1">
                      {result.title}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-normal block">
                    Indeks Risiko
                  </span>
                  <span
                    className={`text-xl font-normal ${
                      result.status === "high_risk"
                        ? "text-red-600"
                        : result.status === "suspicious"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {result.threatScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed font-normal">
                {result.summary}
              </p>

              {/* Indikator Temuan */}
              <div className="bg-white/90 border border-gray-100 rounded-xl p-3 mb-3 space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Indikator Temuan:
                </span>
                {result.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-normal">
                    <Icon
                      icon="solar:check-circle-bold"
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        result.status === "high_risk"
                          ? "text-red-500"
                          : result.status === "suspicious"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs bg-slate-900 text-slate-100 p-3 rounded-xl flex items-start gap-2 font-normal">
                <Icon
                  icon="solar:info-circle-bold-duotone"
                  className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-white font-medium">Langkah Disarankan: </span>
                  <span className="text-slate-300">{result.recommendation}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetScan}
              className="mt-3.5 w-full py-2.5 px-4 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-normal transition-colors flex items-center justify-center gap-2"
            >
              <Icon icon="solar:restart-bold-duotone" className="w-4 h-4" />
              <span>Periksa Data Baru</span>
            </button>
          </div>
        ) : (
          /* INPUT STATE */
          <div className="flex flex-col min-h-[110px] justify-between">
            {/* TAB 1: Link & Text */}
            {activeTab === "text" && (
              <div className="w-full">
                <textarea
                  rows={3}
                  value={textContent}
                  onChange={(e) => handleTextChange(e.target.value)}
                  disabled={isScanning}
                  placeholder="Masukkan tautan, nomor telepon, atau tempel pesan mencurigakan..."
                  className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none resize-none font-normal leading-relaxed"
                />

                {/* Quick Examples */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1 mb-2">
                  <span className="text-[11px] text-slate-400 font-normal">Contoh:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleTextChange(
                        "Peringatan: Akun bank Anda dibatasi. Verifikasi di http://bit.ly/bank-update-id"
                      )
                    }
                    className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-gray-200/80 transition-colors font-normal"
                  >
                    SMS Phishing Bank
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleTextChange(
                        "Selamat! Anda mendapatkan hadiah dana 10jt. Hubungi wa.me/6281298765432"
                      )
                    }
                    className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-gray-200/80 transition-colors font-normal"
                  >
                    WhatsApp Undian
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: File APK */}
            {activeTab === "file" && (
              <div className="w-full py-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk,.pdf,.zip,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileSelect(file);
                  }}
                />

                {!selectedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      const file = e.dataTransfer.files?.[0] || null;
                      handleFileSelect(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? "border-red-500 bg-red-50/40"
                        : "border-gray-200 hover:border-gray-300 bg-slate-50/40 hover:bg-slate-50/80"
                    }`}
                  >
                    <Icon
                      icon="solar:upload-track-2-bold-duotone"
                      className="w-7 h-7 mx-auto mb-2 text-slate-400"
                    />
                    <p className="text-xs sm:text-sm text-slate-700 font-normal">
                      Pilih atau seret berkas APK / Dokumen ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                      Format: .apk, .pdf, .zip (Maksimal 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-200/80 rounded-2xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                        <Icon icon="solar:document-bold-duotone" className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden text-left">
                        <p className="text-xs sm:text-sm text-slate-900 font-normal truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap dipindai
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearCurrentInput}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Gambar Bukti */}
            {activeTab === "image" && (
              <div className="w-full py-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageSelect(file);
                  }}
                />

                {!selectedImage ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                      const file = e.dataTransfer.files?.[0] || null;
                      handleImageSelect(file);
                    }}
                    onClick={() => imageInputRef.current?.click()}
                    className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDraggingImage
                        ? "border-red-500 bg-red-50/40"
                        : "border-gray-200 hover:border-gray-300 bg-slate-50/40 hover:bg-slate-50/80"
                    }`}
                  >
                    <Icon
                      icon="solar:gallery-wide-bold-duotone"
                      className="w-7 h-7 mx-auto mb-2 text-slate-400"
                    />
                    <p className="text-xs sm:text-sm text-slate-700 font-normal">
                      Unggah tangkapan layar bukti transfer / chat
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                      Format: PNG, JPG, WEBP (Maksimal 15MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-200/80 rounded-2xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {imagePreviewUrl ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreviewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                          <Icon icon="solar:gallery-bold-duotone" className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden text-left">
                        <p className="text-xs sm:text-sm text-slate-900 font-normal truncate">
                          {selectedImage.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB • Bukti visual
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearCurrentInput}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs text-red-600 text-left font-normal py-1">
                {errorMessage}
              </p>
            )}

            {/* Scan Step Status */}
            {isScanning && (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-600 font-normal">
                <Icon icon="solar:restart-bold-duotone" className="w-3.5 h-3.5 animate-spin text-red-600" />
                <span>{scanStep}</span>
              </div>
            )}

            {/* Bottom Bar: Action Shortcuts (Kiri) & Submit Button (Kanan persis SphereAI) */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
              {/* Sisi Kiri: Attachment Shortcuts */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("text")}
                  title="Input teks atau tautan"
                  className={`p-2 rounded-full transition-colors ${
                    activeTab === "text"
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon icon="solar:link-circle-bold-duotone" className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleTabSwitch("file");
                    fileInputRef.current?.click();
                  }}
                  title="Lampirkan berkas APK"
                  className={`p-2 rounded-full transition-colors ${
                    activeTab === "file"
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon icon="solar:paperclip-2-bold" className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleTabSwitch("image");
                    imageInputRef.current?.click();
                  }}
                  title="Unggah screenshot"
                  className={`p-2 rounded-full transition-colors ${
                    activeTab === "image"
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon icon="solar:gallery-bold-duotone" className="w-4 h-4" />
                </button>
              </div>

              {/* Sisi Kanan: Circular Arrow Submit Button (Persis SphereAI arrow button) */}
              <button
                type="button"
                onClick={runScan}
                disabled={isScanning}
                aria-label="Pindai data"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-red-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-95"
              >
                {isScanning ? (
                  <Icon icon="solar:restart-bold-duotone" className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon icon="solar:arrow-up-linear" className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
