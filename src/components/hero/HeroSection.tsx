"use client";

import React, { useState, useEffect } from "react";
import { RecognizeCard } from "@/components/recognize/RecognizeCard";

const PHRASES = [
  "penipuan digital.",
  "file APK berbahaya.",
  "tautan phishing bank.",
  "rekayasa sosial & OTP.",
  "struk transfer palsu.",
];

export function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PHRASES[phraseIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentPhrase.length) {
            setCharIndex((prev) => prev + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          if (charIndex > 0) {
            setCharIndex((prev) => prev - 1);
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
          }
        }
      },
      isDeleting ? 40 : 75
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Dynamic Typewriter Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[74px] tracking-tight text-slate-900 leading-[1.08] max-w-3xl mb-8 sm:mb-10 font-normal min-h-[2.2em] sm:min-h-[2.1em] flex flex-col justify-center">
          <span>Kenali & tangkal</span>
          <span className="text-slate-900">
            {PHRASES[phraseIndex].substring(0, charIndex)}
            <span className="inline-block w-[2.5px] sm:w-[3.5px] h-[0.85em] bg-red-600 ml-1.5 translate-y-[2px] animate-pulse" />
          </span>
        </h1>

        {/* Recognize Action Area */}
        <RecognizeCard />

        {/* Bottom Category Tags */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-xs text-slate-400 font-normal mb-3">
            Analisis heuristik cerdas untuk berbagai skenario kejahatan siber:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600 font-normal">
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
