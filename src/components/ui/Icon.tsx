"use client";

import { Icon as IconifyIcon, addCollection, type IconProps } from "@iconify/react/offline";
import { solarIcons } from "@/components/ui/solar-icons";

// Registered once at module scope: the bundled subset makes every icon render without any
// network request, so the CSP (which forbids api.iconify.design) no longer blanks them out.
addCollection(solarIcons);

/** Drop-in replacement for `Icon` from `@iconify/react`, backed by bundled icon data. */
export function Icon(props: IconProps) {
  return <IconifyIcon ssr {...props} />;
}
