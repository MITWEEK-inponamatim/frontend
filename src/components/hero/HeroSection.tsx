import React from "react";
import { RecognizeCard } from "@/components/recognize/RecognizeCard";
import { Icon } from "@iconify/react";

export function HeroSection() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Security Alert Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 mb-5 sm:mb-6 animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-red-700 uppercase">
            AI-Driven Fraud & Scam Defense
          </span>
        </div>

        {/* Main Headline - High contrast, Montserrat typography */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mb-4 sm:mb-6">
          Embrace the Power of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-700">
            AI Scam Detection.
          </span>
        </h1>

        {/* Sub-headline / Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mb-8 sm:mb-10 leading-relaxed font-normal">
          Identifikasi phishing, file malware APK, pesan manipulatif, dan bukti transfer palsu secara instan dengan engine analisis heuristik cerdas.
        </p>

        {/* The "Recognize" Form Card (Replaces 'Learn More +') */}
        <RecognizeCard />

        {/* Secondary feature highlights (Recognize • Learn • Act) */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:shield-check-bold" className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-slate-700">Recognize</span>
            <span>Real-time Scanner</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:square-academic-cap-bold-duotone" className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Learn</span>
            <span>Gamified Scenarios</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:users-group-rounded-bold-duotone" className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Act</span>
            <span>Community Defense</span>
          </div>
        </div>

      </div>
    </section>
  );
}
