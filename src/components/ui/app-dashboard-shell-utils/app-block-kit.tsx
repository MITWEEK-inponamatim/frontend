"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Bagian-bagian kecil yang dipakai kerangka console. Semuanya memakai token `--shell-*`/`--mark-*`
 * dari globals.css, bukan warna Tailwind langsung, supaya satu palet buku register tetap satu
 * sumber dan tidak ada kelas yang perlu diubah kalau rona verdictnya bergeser.
 */

export const blockRoot =
  "relative flex w-full overflow-hidden bg-[var(--shell-bg)] font-sans text-[13px] text-[color:var(--shell-text)] antialiased";

/** Cincin fokus, bukan garis luar: rail dan kartu punya `overflow-hidden` yang memotong outline. */
export const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--shell-focus)]";

/* -----------------------------------------------------------------------------------------------
 * Tombol
 * ---------------------------------------------------------------------------------------------- */

type BlockButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const BUTTON_VARIANT: Record<NonNullable<BlockButtonProps["variant"]>, string> = {
  // Aksi memakai tinta. Tidak ada rona yang bisa disalahartikan sebagai vonis.
  primary:
    "border-[color:var(--shell-accent)] bg-[var(--shell-accent)] text-[color:var(--shell-accent-fill-ink)] hover:brightness-[1.18]",
  secondary:
    "border-[color:var(--shell-border-strong)] bg-[var(--shell-surface)] text-[color:var(--shell-text)] hover:bg-[var(--shell-accent)] hover:text-[color:var(--shell-accent-fill-ink)]",
  ghost:
    "border-transparent bg-transparent text-[color:var(--shell-text-muted)] hover:bg-[var(--shell-hover)] hover:text-[color:var(--shell-text)]",
};

const BUTTON_SIZE = {
  sm: "h-7 gap-1.5 rounded-[8px] px-2.5 text-[12.5px] [&>svg]:size-[15px]",
  md: "h-9 gap-2 rounded-[9px] px-3.5 text-[13px] [&>svg]:size-4",
};

export function BlockButton({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: BlockButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center border font-medium transition-colors duration-150 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-45",
        BUTTON_SIZE[size],
        BUTTON_VARIANT[variant],
        focusRing,
        className,
      )}
      {...rest}
    />
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** label yang sama dipakai sebagai aria-label, title, dan teks untuk pembaca layar. */
  label: string;
  size?: "sm" | "md";
  pressed?: boolean;
};

export function IconButton({
  label,
  size = "md",
  pressed,
  className,
  type = "button",
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "inline-grid shrink-0 cursor-pointer place-items-center border border-transparent text-[color:var(--shell-text-muted)] transition-colors duration-150 motion-reduce:transition-none hover:bg-[var(--shell-hover)] hover:text-[color:var(--shell-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        size === "sm" ? "size-7 rounded-[8px] [&>svg]:size-4" : "size-8 rounded-[9px] [&>svg]:size-[18px]",
        focusRing,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      aria-hidden="true"
      className={cn(
        "rounded-[4px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] px-1.5 py-[3px] font-shell-data text-[10.5px] leading-none text-[color:var(--shell-text-soft)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Avatar inisial
 * ---------------------------------------------------------------------------------------------- */

export function initialsOf(name: string) {
  const parts = name.split(/[\s._@-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return ((parts[0][0] ?? "?") + (parts.length > 1 ? parts[1][0] : "")).toUpperCase();
}

export function InitialsAvatar({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-active)] font-medium leading-none text-[color:var(--shell-text-muted)]",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Drawer
 * ---------------------------------------------------------------------------------------------- */

/**
 * Drawer navigasi untuk container sempit. Panelnya yang dapat fokus, bukan backdrop: kalau fokus
 * jatuh ke tombol penutup, moderator yang menutup dengan Esc kehilangan tempat di daftar.
 */
export function BlockDrawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <button
        type="button"
        aria-label={`Tutup ${label}`}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-[color:rgba(15,20,27,0.45)]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="relative flex h-full w-[268px] max-w-full flex-col overflow-hidden bg-[var(--shell-panel)] shadow-[var(--shell-shadow-menu)] outline-none"
      >
        {children}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Pengukur & pengumuman
 * ---------------------------------------------------------------------------------------------- */

const NOTICE_CLEAR_MS = 5000;

/** Lebar elemen, diukur pada elemennya sendiri. Titik putus viewport salah begitu console berdiri
 *  di samping monitor lebar, dan kerangka ini yang memutuskan rail atau drawer. */
export function useElementWidth(ref: RefObject<Element | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

export function useBlockReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}

/** Live region untuk keputusan dan perubahan rentang. region sudah termasuk `sr-only`. */
export function useAnnouncer() {
  const [message, setMessage] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const announce = useCallback((text: string) => {
    clearTimers();
    // Dikosongkan dulu: teks yang sama persis dua kali tidak dibacakan ulang oleh pembaca layar.
    setMessage("");
    timers.current.push(setTimeout(() => setMessage(text), 60));
    timers.current.push(setTimeout(() => setMessage(""), NOTICE_CLEAR_MS + 60));
  }, []);

  const region = (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  );

  return { announce, region };
}
