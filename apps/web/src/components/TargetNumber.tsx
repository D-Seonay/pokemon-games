import { useI18n } from "../i18n/I18nContext.js";

export function TargetNumber({ id, maxId }: { id: number; maxId: number }) {
  const { lang } = useI18n();
  const width = maxId > 999 ? 4 : 3;
  const label = lang === "en" ? `Target number ${id}` : `Numéro cible ${id}`;

  return (
    <div className="pokedex-card relative my-4 flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[radial-gradient(ellipse_at_center,rgba(255,203,5,0.08)_0%,var(--surface)_75%)] px-4 py-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-dim)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
        <span>Pokédex ID</span>
      </div>
      <p
        aria-label={label}
        className="mono text-center leading-none tracking-tight glow-yellow mt-2"
        style={{ fontSize: "clamp(4.5rem, 18vw, 8.5rem)", color: "var(--accent)" }}
      >
        <span
          aria-hidden="true"
          style={{ fontSize: "0.42em", color: "var(--text-dim)", marginRight: "0.05em" }}
        >
          #
        </span>
        <span>{String(id).padStart(width, "0")}</span>
      </p>
    </div>
  );
}
