import React from "react";

export type ToastVariant = "success" | "info" | "error";

export interface ToastProps {
  variant: ToastVariant;
  title: string;
  description: string;
  className?: string;
}

/**
 * Success icon with circular checkmark.
 */
function SuccessIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-500 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/**
 * Info icon with circular info glyph.
 */
function InfoIcon() {
  return (
    <svg
      className="w-5 h-5 text-sky-500 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/**
 * Error / Warning icon with circular exclamation glyph.
 */
function ErrorIcon() {
  return (
    <svg
      className="w-5 h-5 text-red-500 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

const VARIANT_CONFIGS = {
  success: {
    icon: SuccessIcon,
    cardStyles:
      "bg-gradient-to-r from-[#eefbf4] via-[#fafffc] to-white border-emerald-100/90 shadow-[0_2px_10px_rgba(16,185,129,0.06)]",
  },
  info: {
    icon: InfoIcon,
    cardStyles:
      "bg-gradient-to-r from-[#eff8ff] via-[#f8fbff] to-white border-sky-100/90 shadow-[0_2px_10px_rgba(14,165,233,0.06)]",
  },
  error: {
    icon: ErrorIcon,
    cardStyles:
      "bg-gradient-to-r from-[#fef2f2] via-[#fff8f8] to-white border-rose-100/90 shadow-[0_2px_10px_rgba(239,68,68,0.06)]",
  },
};

/**
 * Universal Toast notification card matching the clean pastel-wash pill design.
 */
export function Toast({ variant, title, description, className = "" }: ToastProps) {
  const config = VARIANT_CONFIGS[variant];
  const IconComponent = config.icon;

  return (
    <div
      role="status"
      className={`w-full rounded-2xl border p-4 sm:p-4.5 flex items-start gap-3.5 text-left transition-all ${config.cardStyles} ${className}`}
    >
      <div className="shrink-0 mt-0.5">
        <IconComponent />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-normal text-slate-900 tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate sm:whitespace-normal">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Dedicated Success Toast component.
 */
export function SuccessToast({
  title,
  description,
  className = "",
}: Omit<ToastProps, "variant">) {
  return <Toast variant="success" title={title} description={description} className={className} />;
}

/**
 * Dedicated Info Toast component.
 */
export function InfoToast({
  title,
  description,
  className = "",
}: Omit<ToastProps, "variant">) {
  return <Toast variant="info" title={title} description={description} className={className} />;
}

/**
 * Dedicated Error Toast component.
 */
export function ErrorToast({
  title,
  description,
  className = "",
}: Omit<ToastProps, "variant">) {
  return <Toast variant="error" title={title} description={description} className={className} />;
}

