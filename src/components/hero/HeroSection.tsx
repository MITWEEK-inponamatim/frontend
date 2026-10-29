import React from "react";
import { RecognizeCard } from "@/components/recognize/RecognizeCard";

export function HeroSection() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* 1. Sleek Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/90 bg-white text-xs text-slate-600 mb-6 sm:mb-8 shadow-2xs font-normal" style={{ fontWeight: 400 }}>
          <span className="text-red-600 text-sm">✦</span>
          <span>Sistem deteksi dini ancaman rekayasa sosial & penipuan digital</span>
        </div>

        {/* 2. Main Headline - Explicitly Book/Reguler (Weight 400), Zero AI Bold Slop */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[74px] tracking-tight text-slate-900 leading-[1.08] max-w-3xl mb-8 sm:mb-10 font-normal"
          style={{ fontWeight: 400 }}
        >
          Kenali & tangkal <br className="hidden sm:inline" />
          modus penipuan digital.
        </h1>

        {/* 3. Recognize Action Area */}
        <RecognizeCard />

        {/* 4. Bottom Category Tags */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-xs text-slate-400 font-normal mb-3" style={{ fontWeight: 400 }}>
            Analisis heuristik cerdas untuk berbagai skenario kejahatan siber:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600 font-normal" style={{ fontWeight: 400 }}>
            <span className="hover:text-slate-900 transition-colors">
              APK Sniffer SMS
            </span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-900 transition-colors">
              Phishing Perbankan
            </span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-900 transition-colors">
              Struk Transfer Palsu
            </span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-900 transition-colors">
              Undian & Undangan Fiktif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
