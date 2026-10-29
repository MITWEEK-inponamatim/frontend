import React from "react";
import { RecognizeCard } from "@/components/recognize/RecognizeCard";

export function HeroSection() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Main Headline - Bold, Clean, High Contrast against pure white (Zero AI Slops) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-slate-900 leading-[1.12] max-w-3xl mb-8 sm:mb-10">
          Embrace the Power of{" "}
          <br className="hidden sm:inline" />
          AI Scam Detection.
        </h1>

        {/* The "Recognize" Form Card (Replaces 'Learn More +') */}
        <RecognizeCard />
      </div>
    </section>
  );
}
