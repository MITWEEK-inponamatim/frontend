import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export function Navbar() {
  return (
    <header className="w-full relative z-20 pt-4 sm:pt-6 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Contact Us Button with sleek capsule indicator */}
        <div className="flex items-center gap-2.5">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-800 hover:text-red-600 transition-colors"
          >
            <span className="w-6 sm:w-8 h-[2px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Center: Minimalist geometric cross logo */}
        <Link
          href="/"
          className="flex items-center justify-center p-2 rounded-lg hover:bg-red-50/50 transition-colors group"
          aria-label="Anti-Scam Platform Home"
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            {/* Minimal Geometric Cross / Plus Logo */}
            <span className="absolute w-[2px] h-6 bg-slate-900 group-hover:bg-red-600 transition-colors rounded-full" />
            <span className="absolute h-[2px] w-6 bg-slate-900 group-hover:bg-red-600 transition-colors rounded-full" />
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full z-10 transition-transform group-hover:scale-125" />
          </div>
        </Link>

        {/* Right: Main Menu with sleek capsule indicator */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-slate-800 hover:text-red-600 transition-colors"
            aria-label="Open main menu"
          >
            <span>Main Menu</span>
            <span className="w-6 sm:w-8 h-[2px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
