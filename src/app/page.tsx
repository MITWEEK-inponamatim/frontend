import React from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { SideOrnaments } from "@/components/hero/SideOrnaments";
import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-white text-slate-900 overflow-x-hidden flex flex-col justify-between">
      {/* 2D Red Alert Geometric Security Ornaments (Left & Right Viewport Edges) */}
      <SideOrnaments />

      {/* Top Navigation */}
      <Navbar />

      {/* Central Hero Section with "Recognize" Form Card */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <HeroSection />
      </main>
    </div>
  );
}
