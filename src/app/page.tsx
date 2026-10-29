import React from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { SideOrnaments } from "@/components/hero/SideOrnaments";
import { HeroSection } from "@/components/hero/HeroSection";
import { ThreatsSection } from "@/components/threats/ThreatsSection";
import { WarningSection } from "@/components/warning/WarningSection";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-white text-slate-900 overflow-x-hidden flex flex-col justify-between">
      {/* Hero Viewport with Dedicated Side Ornaments */}
      <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* 2D Red Alert Geometric Security Ornaments */}
        <SideOrnaments />

        {/* Top Navigation */}
        <Navbar />

        {/* Central Hero Section */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <HeroSection />
        </div>
      </div>

      {/* Content Sections under Hero */}
      <main className="relative z-10 w-full bg-white">
        <ThreatsSection />
        <WarningSection />
      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform • Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Recognize</span>
            <span>•</span>
            <span>Learn</span>
            <span>•</span>
            <span>Act</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
