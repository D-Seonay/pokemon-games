import { colorOfType, labelOfType } from "./types.js";

export function TypeBadge({ type, size = "sm" }: { type: string; size?: "sm" | "md" }) {
  return (
    <span
      className={
        size === "md"
          ? "rounded-full px-3 py-1 text-sm font-bold tracking-wide uppercase inline-flex items-center justify-center shadow-sm select-none"
          : "rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase inline-flex items-center justify-center shadow-sm select-none"
      }
      // Texte sombre sur pastille colorée : les couleurs de types sont claires et
      // saturées, du blanc dessus serait illisible.
      style={{
        background: colorOfType(type),
        color: "#0a0c12",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }}
    >
      {labelOfType(type)}
    </span>
  );
}
