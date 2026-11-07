"use client";

/**
 * Lightweight SVG doodle wallpaper inspired by the authentic WhatsApp chat background.
 */
export function WhatsAppDoodleBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-40 select-none overflow-hidden"
      style={{
        backgroundColor: "#EFEAE2",
        backgroundImage: `radial-gradient(#D6CFC7 0.75px, transparent 0.75px), radial-gradient(#D6CFC7 0.75px, #EFEAE2 0.75px)`,
        backgroundSize: "30px 30px",
        backgroundPosition: "0 0, 15px 15px",
      }}
    >
      <svg
        className="h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="wa-doodles"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Chat bubble icon */}
            <path
              d="M20 20 h24 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h-16 l-6 6 v-6 a4 4 0 0 1 -2 -4 v-14 a4 4 0 0 1 4 -4 z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.2"
            />
            {/* Coffee cup */}
            <path
              d="M75 35 h14 v10 a6 6 0 0 1 -6 6 h-2 a6 6 0 0 1 -6 -6 z M89 38 h4 a2 2 0 0 1 2 2 v2 a2 2 0 0 1 -2 2 h-4"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.2"
            />
            {/* Heart */}
            <path
              d="M25 80 a4 4 0 0 1 6 0 l2 2 l2 -2 a4 4 0 0 1 6 0 a4 4 0 0 1 0 6 l-8 8 l-8 -8 a4 4 0 0 1 0 -6 z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.2"
            />
            {/* Small star */}
            <path
              d="M85 85 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wa-doodles)" />
      </svg>
    </div>
  );
}

