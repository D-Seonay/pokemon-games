import { DEFAULT_SETTINGS, type GameSettings } from "@pkfind/shared";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackLink } from "../components/BackLink.js";
import { Button } from "../components/Button.js";
import { GenerationPicker } from "../components/GenerationPicker.js";
import { RoundTimingPicker } from "../components/RoundTimingPicker.js";

export function SoloSetup() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  return (
    <section className="flex flex-col gap-6">
      <BackLink />
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Partie solo</h1>
        <p className="text-sm text-[var(--text-dim)]">
          Personnalise tes générations et ton rythme de jeu.
        </p>
      </header>

      <GenerationPicker
        value={settings.generations}
        onChange={(generations) => setSettings({ ...settings, generations })}
      />

      <RoundTimingPicker
        durationMs={settings.roundDurationMs}
        roundCount={settings.roundCount}
        onDurationChange={(roundDurationMs) => setSettings({ ...settings, roundDurationMs })}
        onCountChange={(roundCount) => setSettings({ ...settings, roundCount })}
      />

      <Button
        disabled={settings.generations.length === 0}
        onClick={() => navigate("/solo/play", { state: settings })}
        className="py-3.5 text-base mt-2"
      >
        Lancer
      </Button>
    </section>
  );
}
