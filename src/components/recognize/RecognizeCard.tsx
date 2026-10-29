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
    <div className="w-full max-w-xl mx-auto">
      {/* Main Unified Input Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-6 transition-all">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => handleTabSwitch("text")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "text"
                ? "bg-white text-slate-900 shadow-sm border border-gray-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Icon
              icon="solar:link-circle-bold-duotone"
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === "text" ? "text-red-600" : "text-slate-500"
              }`}
            />
            <span>Link/Text</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("file")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "file"
                ? "bg-white text-slate-900 shadow-sm border border-gray-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Icon
              icon="solar:document-bold-duotone"
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === "file" ? "text-red-600" : "text-slate-500"
              }`}
            />
            <span>File/APK</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("image")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "image"
                ? "bg-white text-slate-900 shadow-sm border border-gray-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Icon
              icon="solar:gallery-wide-bold-duotone"
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === "image" ? "text-red-600" : "text-slate-500"
              }`}
            />
            <span>Image</span>
          </button>
        </div>

        {/* Scan Result State */}
        {result ? (
          <div className="mb-5 animate-in fade-in duration-200">
            <div
              className={`border rounded-xl p-4 sm:p-5 ${
                result.status === "high_risk"
                  ? "bg-red-50/70 border-red-200 text-red-950"
                  : result.status === "suspicious"
                  ? "bg-amber-50/70 border-amber-200 text-amber-950"
                  : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-2 rounded-lg ${
                      result.status === "high_risk"
                        ? "bg-red-600 text-white"
                        : result.status === "suspicious"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
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
                      className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        result.status === "high_risk"
                          ? "bg-red-200/80 text-red-800"
                          : result.status === "suspicious"
                          ? "bg-amber-200/80 text-amber-800"
                          : "bg-emerald-200/80 text-emerald-800"
                      }`}
                    >
                      {result.status === "high_risk"
                        ? "Bahaya Tinggi"
                        : result.status === "suspicious"
                        ? "Mencurigakan"
                        : "Terverifikasi Aman"}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                      {result.title}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">
                    Threat Index
                  </span>
                  <span
                    className={`text-lg font-extrabold ${
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

              <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed">
                {result.summary}
              </p>

              {/* Threat Indicators List */}
              <div className="bg-white/80 border border-black/5 rounded-lg p-3 mb-3 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Indikator Temuan AI:
                </span>
                {result.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
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

              <div className="text-xs bg-slate-900 text-slate-100 p-2.5 rounded-lg flex items-start gap-2">
                <Icon
                  icon="solar:info-circle-bold-duotone"
                  className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
                />
                <div>
                  <span className="font-semibold text-white">Rekomendasi Tindakan: </span>
                  <span className="text-slate-300">{result.recommendation}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetScan}
              className="mt-3 w-full py-2 px-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon icon="solar:restart-bold-duotone" className="w-4 h-4" />
              <span>Periksa Data Lainnya</span>
            </button>
          </div>
        ) : (
          /* Input Fields Container */
          <div className="space-y-4 mb-5">
            {/* TAB 1: Link/Text Input */}
            {activeTab === "text" && (
              <div className="space-y-2.5">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={textContent}
                    onChange={(e) => handleTextChange(e.target.value)}
                    disabled={isScanning}
                    placeholder="Tempel tautan (URL), nomor telepon WhatsApp, SMS perbankan, atau pesan chat mencurigakan di sini..."
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 border border-gray-200 rounded-xl p-3 sm:p-3.5 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                  />
                  {textContent && (
                    <button
                      type="button"
                      onClick={clearCurrentInput}
                      aria-label="Clear input"
                      className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                    >
                      <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Example Quick-Pick Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Contoh cepat:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleTextChange(
                        "Pemberitahuan: Rekening Anda dibekukan sementara. Verifikasi segera di http://bit.ly/bank-update-id"
                      )
                    }
                    className="text-[11px] bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 px-2 py-0.5 rounded-md border border-slate-200/60 transition-colors"
                  >
                    SMS Phishing Bank
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleTextChange(
                        "Selamat! Nomor Anda terpilih memenangkan saldo 10jt. Klaim ke wa.me/6281298765432"
                      )
                    }
                    className="text-[11px] bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 px-2 py-0.5 rounded-md border border-slate-200/60 transition-colors"
                  >
                    WhatsApp Undian
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: File / APK Dropzone */}
            {activeTab === "file" && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk,.pdf,.zip,.exe,.docx"
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
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? "border-red-500 bg-red-50/50"
                        : "border-gray-300 hover:border-red-400 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-11 h-11 mx-auto mb-2.5 rounded-full bg-red-100/70 text-red-600 flex items-center justify-center">
                      <Icon
                        icon="solar:upload-track-2-bold-duotone"
                        className="w-6 h-6"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                      Klik untuk unggah atau seret file APK / Dokumen
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Format didukung: <span className="font-semibold text-slate-700">.APK, .PDF, .ZIP, .DOCX</span> (Maks. 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                        <Icon
                          icon="solar:shield-warning-bold-duotone"
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • File Siap Dianalisis
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearCurrentInput}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus file"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Image Dropzone */}
            {activeTab === "image" && (
              <div className="space-y-2">
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
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDraggingImage
                        ? "border-red-500 bg-red-50/50"
                        : "border-gray-300 hover:border-red-400 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-11 h-11 mx-auto mb-2.5 rounded-full bg-red-100/70 text-red-600 flex items-center justify-center">
                      <Icon
                        icon="solar:gallery-wide-bold-duotone"
                        className="w-6 h-6"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                      Unggah screenshot bukti chat / struk transfer
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Format didukung: <span className="font-semibold text-slate-700">PNG, JPG, WEBP</span> (Maks. 15MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {imagePreviewUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreviewUrl}
                            alt="Preview screenshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                          <Icon
                            icon="solar:gallery-bold-duotone"
                            className="w-5 h-5"
                          />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {selectedImage.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB • Bukti Visual Terpilih
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearCurrentInput}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus gambar"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Feedback State */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 animate-in fade-in">
            <Icon icon="solar:danger-circle-bold" className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scan Progress State */}
        {isScanning && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-600">
              <Icon
                icon="solar:scanner-bold-duotone"
                className="w-4 h-4 animate-spin"
              />
              <span>{scanStep}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        )}

        {/* Prominent Action Button: Scan with AI */}
        {!result && (
          <button
            type="button"
            onClick={runScan}
            disabled={isScanning}
            className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-300 text-white font-semibold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:scale-[0.99]"
          >
            {isScanning ? (
              <>
                <Icon
                  icon="solar:restart-bold-duotone"
                  className="w-5 h-5 animate-spin"
                />
                <span>Menganalisis Payload...</span>
              </>
            ) : (
              <>
                <Icon icon="solar:scanner-bold-duotone" className="w-5 h-5" />
                <span>Scan with AI</span>
              </>
            )}
          </button>
        )}

        {/* Footer Guarantee */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Icon icon="solar:shield-check-bold" className="w-3.5 h-3.5 text-slate-400" />
          <span>Privasi terjaga: File & data tidak disimpan di server publik.</span>
        </div>
      </div>
    </div>
  );
}
