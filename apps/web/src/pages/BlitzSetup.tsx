import {
  BLITZ_DURATIONS,
  type BlitzDurationMs,
  type BlitzSettings,
  DEFAULT_BLITZ_SETTINGS,
  buildPool,
} from "@pkfind/shared";
import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackLink } from "../components/BackLink.js";
import { Button } from "../components/Button.js";
import { GenerationPicker } from "../components/GenerationPicker.js";
import { useI18n } from "../i18n/I18nContext.js";

export function formatBlitzDuration(ms: number): string {
  return ms === 60_000 ? "1 min" : `${ms / 60_000} min`;
}

export function BlitzSetup() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<BlitzSettings>(DEFAULT_BLITZ_SETTINGS);
  const durationGroup = useId();

  const pool = useMemo(() => buildPool(settings.generations), [settings.generations]);

  return (
    <section className="flex flex-col gap-6">
      <BackLink />
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.blitzSetupTitle}</h1>
        <p className="text-sm text-[var(--text-dim)]">
          {lang === "en"
            ? "Name as many Pokémon as you can before time expires. French and English names are accepted and submit automatically."
            : "Nommez le plus de Pokémon possible avant la fin du temps. Les noms français et anglais sont acceptés, et se valident tout seuls dès qu'ils sont complets."}
        </p>
      </header>

      <GenerationPicker
        value={settings.generations}
        onChange={(generations) => setSettings({ ...settings, generations })}
      />

      <fieldset className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
          {lang === "en" ? "Session duration" : "Durée de la session"}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BLITZ_DURATIONS.map((duration) => {
            const checked = settings.durationMs === duration;
            return (
              <label
                key={duration}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2.5 transition-all select-none ${
                  checked
                    ? "border-[var(--accent-2)] bg-[color-mix(in_srgb,var(--accent-2)_12%,var(--surface-2))] shadow-[0_0_10px_rgba(61,123,255,0.15)] text-[var(--text)] font-bold"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                }`}
              >
                <input
                  type="radio"
                  name={durationGroup}
                  aria-label={formatBlitzDuration(duration)}
                  checked={checked}
                  onChange={() => setSettings({ ...settings, durationMs: duration })}
                  className="accent-[var(--accent-2)] h-4 w-4 cursor-pointer"
                />
                <span className="mono text-sm">{formatBlitzDuration(duration)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="pokedex-card p-4 flex items-center justify-between">
        <span className="text-xs uppercase font-semibold text-[var(--text-dim)]">
          {lang === "en" ? "Target" : "Objectif"}
        </span>
        <p className="mono text-sm font-bold text-[var(--accent-2)]">
          {lang === "en"
            ? `${pool.ids.length} Pokémon to find in ${formatBlitzDuration(settings.durationMs)}.`
            : `${pool.ids.length} Pokémon à retrouver en ${formatBlitzDuration(settings.durationMs)}.`}
        </p>
      </div>

      <Button
        disabled={settings.generations.length === 0}
        onClick={() => navigate("/blitz/play", { state: settings })}
        className="py-3.5 text-base"
      >
        {lang === "en" ? "Start" : "Lancer"}
      </Button>
    </section>
  );
}

export type { BlitzDurationMs };
