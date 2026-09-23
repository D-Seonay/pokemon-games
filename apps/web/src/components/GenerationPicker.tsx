import { ALL_GENERATIONS, type GenerationId } from "@pkfind/shared";
import { useI18n } from "../i18n/I18nContext.js";
import { Button } from "./Button.js";

type Props = { value: GenerationId[]; onChange: (next: GenerationId[]) => void };

const REGIONS_FR: Record<GenerationId, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unys",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

const REGIONS_EN: Record<GenerationId, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unova",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

export function GenerationPicker({ value, onChange }: Props) {
  const { lang, t } = useI18n();
  const regions = lang === "en" ? REGIONS_EN : REGIONS_FR;

  function toggle(gen: GenerationId): void {
    if (value.includes(gen)) {
      if (value.length === 1) return; // au moins une génération doit rester cochée
      onChange(value.filter((g) => g !== gen));
    } else {
      onChange([...value, gen].sort((a, b) => a - b));
    }
  }

  return (
    <fieldset className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
        {t.generationsLabel}
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ALL_GENERATIONS.map((gen) => {
          const checked = value.includes(gen);
          const genLabel = lang === "en" ? `Generation ${gen}` : `Génération ${gen}`;
          return (
            <label
              key={gen}
              className={`flex cursor-pointer items-center justify-between rounded-[var(--radius-sm)] border px-3 py-2.5 transition-all select-none ${
                checked
                  ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface-2))] shadow-[0_0_10px_rgba(255,203,5,0.12)] text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  aria-label={genLabel}
                  checked={checked}
                  onChange={() => toggle(gen)}
                  className="accent-[var(--accent)] h-4 w-4 cursor-pointer"
                />
                <span className="text-sm font-semibold">{genLabel}</span>
              </div>
              <span className="text-xs font-medium text-[var(--text-dim)]">{regions[gen]}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange([...ALL_GENERATIONS])}
          className="text-xs py-2"
        >
          {lang === "en" ? "Select All" : "Tout sélectionner"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange([1])}
          className="text-xs py-2"
        >
          {lang === "en" ? "Gen 1 only" : "Gén 1 seulement"}
        </Button>
      </div>
    </fieldset>
  );
}
