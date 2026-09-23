import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

const STYLES: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-[var(--accent)] hover:bg-[#ffd833] active:bg-[#e6b700] text-[#0a0c12] font-extrabold shadow-[0_2px_12px_rgba(255,203,5,0.25)] hover:shadow-[0_4px_20px_rgba(255,203,5,0.4)]",
  ghost:
    "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)] shadow-sm",
  danger:
    "bg-[var(--danger)] hover:bg-[#ff6978] active:bg-[#e63e4f] text-white font-semibold shadow-[0_2px_12px_rgba(255,77,94,0.3)] hover:shadow-[0_4px_18px_rgba(255,77,94,0.45)]",
};

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={`relative inline-flex items-center justify-center rounded-[var(--radius-sm)] px-5 py-3 transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 disabled:shadow-none cursor-pointer ${STYLES[variant]} ${className}`}
    />
  );
}
