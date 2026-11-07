import React from "react";
import { SuccessToast, InfoToast, ErrorToast } from "@/components/ui/Toast";

export function WarningSection() {
  return (
    <section className="w-full bg-white text-slate-900 border-t border-gray-100 py-16 sm:py-24 px-4 sm:px-8 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28">
        {/* ROW 1: Graphic (Left) & Content (Right) - Sesuai Foto 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Sisi Kiri: Dark Telemetry Card dengan Aksen Lime Circle */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              {/* Vibrant Lime Accent Shape di Belakang */}
              <div
                className="absolute -top-3 -left-3 w-44 h-44 sm:w-52 sm:h-52 bg-[#d9f94a] rounded-3xl -rotate-6 z-0"
                aria-hidden="true"
              />

              {/* Dark Telemetry / Chart Card */}
              <div className="relative z-10 w-full bg-[#111317] text-white p-6 rounded-2xl shadow-xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">
                      TELEMETRI ANCAMAN SIBER
                    </span>
                  </div>
                  <span className="text-emerald-400 font-semibold">
                    +98.4% Terdeteksi
                  </span>
                </div>

                {/* SVG Line Chart (seperti di referensi foto) */}
                <div className="w-full h-32 flex items-end mb-4">
                  <svg
                    viewBox="0 0 300 100"
                    className="w-full h-full overflow-visible"
                    fill="none"
                  >
                    <path
                      d="M 0 75 Q 35 25, 70 65 T 140 40 T 210 80 T 300 20"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 0 85 Q 70 80, 150 90 T 300 65"
                      stroke="#d9f94a"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Vektor: APK Sniffer SMS</span>
                  <span className="text-red-400 font-medium">
                    Status: Intercepted
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Headline & Deskripsi */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight text-slate-900 leading-[1.1] mb-5">
              Deteksi Ancaman <br className="hidden sm:inline" />
              Secara Real-Time
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Tidak perlu menunggu hingga saldo terkuras atau data bocor. Mesin
              analisis kami memeriksa berkas biner APK, tautan phishing
              terselubung, dan indikasi manipulasi visual dalam hitungan detik
              sebelum malware sempat mengakses ponsel Anda.
            </p>
          </div>
        </div>

        {/* ROW 2: Content (Left) & Graphic (Right) - Sesuai Foto 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Sisi Kiri: Headline & Deskripsi */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left order-2 lg:order-1">
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight text-slate-900 leading-[1.1] mb-5">
              Rp 1,4 Triliun <br className="hidden sm:inline" />
              Lenyap Akibat Penipuan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Kerugian finansial akibat rekayasa sosial terus memecahkan rekor.
              Pelaku memanfaatkan rasa panik dan ketergesaan korban dengan
              menyamar sebagai kurir paket, petugas pajak, atau bank resmi.
              Mengetahui pola peringatan dini adalah benteng pertahanan terbaik
              Anda.
            </p>
          </div>

          {/* Sisi Kanan: Toast Notifications Stack Sesuai Desain */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-md flex items-center justify-center py-6">
              {/* Background Accent Circle */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 bg-slate-100/80 rounded-full z-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Toast Notifications Stack */}
              <div className="relative z-10 w-full space-y-3.5">
                <SuccessToast
                  title="Perlindungan Real-Time Aktif"
                  description="Sistem otomatis berhasil mengamankan akses data & rekening"
                />
                <InfoToast
                  title="Domain Phishing Terdeteksi"
                  description="Alamat bca-verifikasi.biz.id masuk dalam daftar pemblokiran"
                />
                <ErrorToast
                  title="Izin SMS Intercept Berbahaya"
                  description="Berkas Undangan-Pernikahan.apk mencoba membaca kode OTP"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
