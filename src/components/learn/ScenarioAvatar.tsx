import React from "react";

interface ScenarioAvatarProps {
  initial: string;
  name: string;
  avatarUrl?: string | null;
  colorClass?: string;
}

/**
 * Renders a circular persona avatar image with initials fallback and a subtle red accent ring.
 */
export function ScenarioAvatar({
  initial,
  name,
  avatarUrl = null,
  colorClass = "bg-rose-100 text-rose-800",
}: ScenarioAvatarProps) {
  return (
    <div
      className={`relative h-14 w-14 rounded-full border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-sm font-normal tracking-tight ring-2 ring-red-100 group-hover:ring-red-300 transition-all ${colorClass}`}
      aria-label={name}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
