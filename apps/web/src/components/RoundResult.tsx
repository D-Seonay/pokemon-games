import { type Pool, gapBetween, pokemonById, tryPokemonById } from "@pkfind/shared";
import { useEffect, useRef } from "react";
import { formatPokedexNumber } from "../format.js";
import type { SoloRound } from "../game/useSoloGame.js";
import { PokemonSprite } from "./PokemonSprite.js";

export function RoundResult({
  round,
  pool,
  onSkip,
}: {
  round: SoloRound;
  pool: Pool;
  onSkip?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // Le champ de réponse disparaît avec la manche (voir PokemonCombobox, qui se focalise
  // lui-même dès qu'il redevient disponible) : sans ce transfert, le focus retomberait sur
  // <body> et un joueur au clavier devrait tabuler à l'aveugle pour retrouver le seul
  // élément actionnable de cet écran, ce panneau. L'effet se rejoue à chaque manche car ce
  // composant est démonté puis remonté à chaque révélation (voir SoloGame/Daily, qui
  // alternent entre lui et PokemonCombobox selon la phase).
  useEffect(() => {
    sectionRef.current?.focus();
  }, []);

  const target = pokemonById(round.targetId);
  const answer = round.answerId === null ? null : tryPokemonById(round.answerId);
  const gap = round.answerId === null ? null : gapBetween(round.targetId, round.answerId);

  // Le sens de l'erreur : avec l'écart seul, on ne sait pas de quel côté de la cible on
  // est tombé. C'est ce qui rend la manche instructive plutôt que juste sanctionnée.
  const direction =
    round.answerId === null || round.answerId === round.targetId
      ? ""
      : round.answerId < round.targetId
        ? ", trop bas"
        : ", trop haut";

  const isExact = round.points === 1000;
  const isGood = round.points >= 500;

  return (
    <section
      ref={sectionRef}
      role="button"
      tabIndex={0}
      aria-live="polite"
      onClick={onSkip}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSkip?.();
      }}
      className={`pokedex-card flex flex-col items-center gap-3 p-6 text-center cursor-pointer transition-all outline-none focus-visible:border-[var(--accent)] ${
        isExact
          ? "border-[var(--success)] shadow-[0_0_30px_rgba(53,208,127,0.25)] bg-[radial-gradient(ellipse_at_top,rgba(53,208,127,0.12)_0%,var(--surface)_70%)]"
          : isGood
          ? "border-[var(--accent)] shadow-[0_0_25px_rgba(255,203,5,0.15)] bg-[radial-gradient(ellipse_at_top,rgba(255,203,5,0.08)_0%,var(--surface)_70%)]"
          : "border-[var(--border)]"
      }`}
    >
      <div className="relative flex items-center justify-center p-3">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-md -z-0"
        />
        <div className="relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
          <PokemonSprite pokemon={target} size={160} />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-3xl font-extrabold tracking-tight text-[var(--text)]">{target.nameFr}</p>
        <p className="mono text-sm font-semibold text-[var(--text-dim)]">
          {formatPokedexNumber(target.id, pool.maxId)}
        </p>
      </div>

      <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-dim)]">
        <p>
          {answer
            ? `Votre réponse : ${answer.nameFr} ${formatPokedexNumber(answer.id, pool.maxId)} — écart ${gap}${direction}`
            : "Pas de réponse — temps écoulé"}
        </p>
      </div>

      <p
        className="mono text-5xl font-black tracking-tight"
        style={{
          color: isExact ? "var(--success)" : "var(--accent)",
          textShadow: isExact
            ? "0 0 25px rgba(53,208,127,0.5)"
            : "0 0 25px rgba(255,203,5,0.4)",
        }}
      >
        +{round.points}
      </p>

      {onSkip && (
        <p className="text-xs font-medium text-[var(--text-dim)] bg-[var(--surface-2)]/60 px-3 py-1 rounded-full border border-[var(--border)]/60">
          Clic ou Entrée pour continuer
        </p>
      )}
    </section>
  );
}
