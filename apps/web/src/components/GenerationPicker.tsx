import { ALL_GENERATIONS, type GenerationId } from "@pkfind/shared";
import { Button } from "./Button.js";

type Props = { value: GenerationId[]; onChange: (next: GenerationId[]) => void };

const REGIONS: Record<GenerationId, string> = {
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

export function GenerationPicker({ value, onChange }: Props) {
  function toggle(gen: GenerationId): void {
    if (value.includes(gen)) {
      if (value.length === 1) return; // au moins une génération doit rester cochée
      onChange(value.filter((item) => item !== gen));
      return;
    }
    onChange([...value, gen].sort((a, b) => a - b));
  }

  return (
    <fieldset className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
        Générations
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ALL_GENERATIONS.map((gen) => {
          const checked = value.includes(gen);
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
                  aria-label={`Génération ${gen}`}
                  checked={checked}
                  onChange={() => toggle(gen)}
                  className="accent-[var(--accent)] h-4 w-4 cursor-pointer"
                />
                <span className="mono font-bold text-sm">Gén {gen}</span>
              </div>
              <span className="text-[11px] font-medium opacity-60">{REGIONS[gen]}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="button" variant="ghost" onClick={() => onChange([...ALL_GENERATIONS])} className="text-xs py-2">
          Tout sélectionner
        </Button>
        <Button type="button" variant="ghost" onClick={() => onChange([1])} className="text-xs py-2">
          Gén 1 seulement
        </Button>
      </div>
    </fieldset>
  );
}
