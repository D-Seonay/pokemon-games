import { type GameSettings, randomSeed, validateSettings } from "@pkfind/shared";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { GameOver } from "../components/GameOver.js";
import { PokemonCombobox } from "../components/PokemonCombobox.js";
import { RoundResult } from "../components/RoundResult.js";
import { TargetNumber } from "../components/TargetNumber.js";
import { Timer } from "../components/Timer.js";
import { useSoloGame } from "../game/useSoloGame.js";
import { Button } from "../components/Button.js";

export function SoloGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const [seed, setSeed] = useState(randomSeed);

  let settings: GameSettings;
  try {
    settings = validateSettings(location.state);
  } catch {
    return <Navigate to="/solo" replace />;
  }

  return (
    // La clé force un démontage/remontage complet à chaque nouvelle graine : `useSoloGame`
    // initialise son état (manche, chrono, historique) avec des `useState` qui ne se
    // réexécutent qu'au montage. Sans cette clé, rejouer changerait bien la graine et donc
    // les cibles tirées, mais la partie resterait bloquée sur l'écran de fin — l'état de la
    // manche précédente ne serait jamais réinitialisé.
    <SoloGameBoard
      key={seed}
      settings={settings}
      seed={seed}
      onReplay={() => setSeed(randomSeed())}
      onQuit={() => navigate("/solo")}
    />
  );
}

function SoloGameBoard({
  settings,
  seed,
  onReplay,
  onQuit,
}: {
  settings: GameSettings;
  seed: string;
  onReplay: () => void;
  onQuit: () => void;
}) {
  const game = useSoloGame(settings, seed);

  if (game.phase === "finished") {
    return (
      <div className="flex flex-col gap-3">
        <GameOver rounds={game.rounds} settings={settings} onReplay={onReplay} />
        <Button variant="ghost" onClick={onQuit} className="w-full">
          Changer les réglages
        </Button>
      </div>
    );
  }

  const lastRound = game.rounds[game.rounds.length - 1];

  return (
    <section className="flex flex-col gap-4">
      <header className="pokedex-card flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_6px_var(--accent-2)]" />
          <p className="mono text-sm font-semibold text-[var(--text-dim)]">
            Manche {game.roundIndex + 1} / {game.roundCount}
          </p>
        </div>
        <p className="mono font-bold text-base text-[var(--accent)] glow-yellow">
          {game.totalScore} pts
        </p>
      </header>

      {game.phase === "round" ? (
        <>
          <Timer remainingMs={game.remainingMs} totalMs={settings.roundDurationMs} />
          <TargetNumber id={game.targetId} maxId={game.pool.maxId} />
          <PokemonCombobox pool={game.pool} onSubmit={(pokemon) => game.answer(pokemon.id)} />
        </>
      ) : (
        lastRound && <RoundResult round={lastRound} pool={game.pool} onSkip={game.skipReveal} />
      )}
    </section>
  );
}
