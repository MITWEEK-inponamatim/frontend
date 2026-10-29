import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full relative z-20 pt-5 sm:pt-7 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Contact Us Button with sleek horizontal capsule indicator */}
        <div className="flex items-center gap-2.5">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-tight text-slate-900 hover:text-red-600 transition-colors"
          >
            <span className="w-6 sm:w-8 h-[2px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Center: Minimalist geometric cross logo matching reference */}
        <Link
          href="/"
          className="flex items-center justify-center p-2 rounded-lg hover:opacity-75 transition-opacity group"
          aria-label="Anti-Scam Platform Home"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span className="absolute w-[2px] h-5 bg-slate-900 rounded-full" />
            <span className="absolute h-[2px] w-5 bg-slate-900 rounded-full" />
          </div>
        </Link>

        {/* Right: Main Menu with sleek horizontal capsule indicator */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-tight text-slate-900 hover:text-red-600 transition-colors"
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
