import React from "react";

export function SideOrnaments() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Left 2D Red Alert Gradient & Abstract Pattern */}
      <div className="absolute top-0 left-0 w-36 sm:w-64 md:w-80 lg:w-96 h-full opacity-70 transition-opacity">
        {/* Soft edge gradient from red to transparent */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-red-500/10 via-red-500/4 to-transparent" />
        
        {/* 2D Abstract Red Security Geometric Contour Lines */}
        <svg
          className="absolute top-1/2 -translate-y-1/2 -left-12 sm:-left-6 w-72 sm:w-96 h-[580px] stroke-red-600/20 fill-none"
          viewBox="0 0 300 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -50,50 C 120,120 180,240 180,300 C 180,360 120,480 -50,550"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M -30,80 C 140,150 200,250 200,300 C 200,350 140,450 -30,520"
            strokeWidth="2"
          />
          <path
            d="M -10,110 C 160,180 220,260 220,300 C 220,340 160,420 -10,490"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d="M 10,140 C 180,200 240,270 240,300 C 240,330 180,400 10,460"
            strokeWidth="1.5"
          />
          {/* Subtle Radar/Alert concentric circles */}
          <circle cx="10" cy="300" r="160" strokeWidth="1" stroke="rgba(239, 68, 68, 0.12)" />
          <circle cx="10" cy="300" r="220" strokeWidth="1" stroke="rgba(239, 68, 68, 0.08)" strokeDasharray="6 6" />
        </svg>

        {/* Vertical decorative alert border accent */}
        <div className="absolute top-1/4 left-0 h-1/2 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-80" />
      </div>

      {/* Right 2D Red Alert Gradient & Abstract Pattern */}
      <div className="absolute top-0 right-0 w-36 sm:w-64 md:w-80 lg:w-96 h-full opacity-70 transition-opacity">
        {/* Soft edge gradient from red to transparent */}
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-red-500/10 via-red-500/4 to-transparent" />

        {/* 2D Abstract Red Security Geometric Contour Lines */}
        <svg
          className="absolute top-1/2 -translate-y-1/2 -right-12 sm:-right-6 w-72 sm:w-96 h-[580px] stroke-red-600/20 fill-none"
          viewBox="0 0 300 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 350,50 C 180,120 120,240 120,300 C 120,360 180,480 350,550"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 330,80 C 160,150 100,250 100,300 C 100,350 160,450 330,520"
            strokeWidth="2"
          />
          <path
            d="M 310,110 C 140,180 80,260 80,300 C 80,340 140,420 310,490"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d="M 290,140 C 120,200 60,270 60,300 C 60,330 120,400 290,460"
            strokeWidth="1.5"
          />
          {/* Subtle Radar/Alert concentric circles */}
          <circle cx="290" cy="300" r="160" strokeWidth="1" stroke="rgba(239, 68, 68, 0.12)" />
          <circle cx="290" cy="300" r="220" strokeWidth="1" stroke="rgba(239, 68, 68, 0.08)" strokeDasharray="6 6" />
        </svg>

        {/* Vertical decorative alert border accent */}
        <div className="absolute top-1/4 right-0 h-1/2 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-80" />
      </div>
    </div>
  );
}
