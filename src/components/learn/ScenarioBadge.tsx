import React from "react";

interface ScenarioBadgeProps {
  label: string;
}

/**
 * Renders a threat category pill badge with ThreatLens Red styling.
 */
export function ScenarioBadge({ label }: ScenarioBadgeProps) {
  return (
    <span className="rounded-full border border-red-200/80 bg-black px-3 py-0.5 text-[10px] font-normal uppercase tracking-wider text-white shadow-2xs whitespace-nowrap">
      {label}
    </span>
  );
}
