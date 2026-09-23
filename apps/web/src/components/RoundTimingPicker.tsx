import {
  ROUND_COUNTS,
  ROUND_DURATIONS,
  type RoundCount,
  type RoundDurationMs,
} from "@pkfind/shared";
import { useId } from "react";
import { formatRoundDuration } from "../format.js";
import { useI18n } from "../i18n/I18nContext.js";

/**
 * Le temps par manche et le nombre de manches, partagés par la configuration solo et le
 * lobby multijoueur — même rôle que `GenerationPicker` pour les générations. Purement
 * présentationnel : c'est à l'appelant de décider si le changement part sur le réseau
 * (multi, avec état optimiste) ou reste local (solo).
 */
export function RoundTimingPicker({
  durationMs,
  roundCount,
  onDurationChange,
  onCountChange,
}: {
  durationMs: RoundDurationMs;
  roundCount: RoundCount;
  onDurationChange: (value: RoundDurationMs) => void;
  onCountChange: (value: RoundCount) => void;
}) {
  const { lang } = useI18n();
  const durationGroup = useId();
  const countGroup = useId();

  return (
    <>
      <fieldset className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
          {lang === "en" ? "Time per round" : "Temps par manche"}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {ROUND_DURATIONS.map((duration) => {
            const checked = durationMs === duration;
            const durationLabel = formatRoundDuration(duration);
            return (
              <label
                key={duration}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2.5 transition-all select-none ${
                  checked
                    ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface-2))] shadow-[0_0_10px_rgba(255,203,5,0.12)] text-[var(--text)] font-bold"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                }`}
              >
                <input
                  type="radio"
                  name={durationGroup}
                  aria-label={durationLabel}
                  checked={checked}
                  onChange={() => onDurationChange(duration)}
                  className="accent-[var(--accent)] h-4 w-4 cursor-pointer"
                />
                <span className="mono text-sm">{durationLabel}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
          {lang === "en" ? "Number of rounds" : "Nombre de manches"}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {ROUND_COUNTS.map((count) => {
            const checked = roundCount === count;
            const countLabel = lang === "en" ? `${count} rounds` : `${count} manches`;
            return (
              <label
                key={count}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2.5 transition-all select-none ${
                  checked
                    ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface-2))] shadow-[0_0_10px_rgba(255,203,5,0.12)] text-[var(--text)] font-bold"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                }`}
              >
                <input
                  type="radio"
                  name={countGroup}
                  aria-label={countLabel}
                  checked={checked}
                  onChange={() => onCountChange(count)}
                  className="accent-[var(--accent)] h-4 w-4 cursor-pointer"
                />
                <span className="mono text-sm">{countLabel}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}
