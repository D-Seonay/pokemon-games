import {
  type GameSettings,
  MAX_SCORE,
  buildPool,
  gapBetween,
  pokemonById,
  tryPokemonById,
} from "@pkfind/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPokedexNumber } from "../format.js";
import type { SoloRound } from "../game/useSoloGame.js";
import { useI18n } from "../i18n/I18nContext.js";
import { readBest, saveBest } from "../storage/scores.js";
import {
  type SoloHistoryEntry,
  computeStats,
  readSoloHistory,
  recordSoloGame,
  toStatsRounds,
} from "../storage/stats.js";
import { Button } from "./Button.js";

export function GameOver({
  rounds,
  settings,
  onReplay,
}: {
  rounds: SoloRound[];
  settings: GameSettings;
  onReplay: () => void;
}) {
  const { lang, t, pokemonName } = useI18n();
  const total = rounds.reduce((sum, round) => sum + round.points, 0);
  const maxId = useMemo(() => buildPool(settings.generations).maxId, [settings.generations]);

  // Lu une seule fois, via l'état initial paresseux de useState : cette valeur est capturée
  // avant que quoi que ce soit n'écrive dans le stockage. En StrictMode, React double-invoque
  // le rendu en développement ; si on lisait `readBest` directement dans le corps du composant
  // après un `saveBest` déclenché au premier rendu, le second rendu verrait déjà le score du
  // jour enregistré et casserait le calcul du record. L'initialiseur paresseux ne s'exécute
  // qu'au montage, jamais sur les rendus suivants.
  const [previousBest] = useState<number | null>(() => readBest(settings)?.score ?? null);
  const isRecord = previousBest === null || total > previousBest;

  // Même piège, même remède : l'historique d'AVANT cette partie est capturé une seule fois au
  // montage, avant que l'effet ci-dessous n'y ajoute la partie en cours. Les statistiques
  // affichées combinent cet historique figé avec les manches de la partie courante, calculées
  // en mémoire — on n'a donc jamais besoin de relire le stockage après l'écriture, ce qui
  // évite complètement le piège de lecture-après-écriture en StrictMode.
  const [priorHistory] = useState<SoloHistoryEntry[]>(() => readSoloHistory());
  const stats = useMemo(() => {
    const currentEntry: SoloHistoryEntry = { date: "", rounds: toStatsRounds(rounds) };
    return computeStats([...priorHistory, currentEntry]);
  }, [priorHistory, rounds]);

  useEffect(() => {
    // L'écriture est un effet de bord : elle doit avoir lieu après le rendu, pas pendant.
    // `saveBest` est idempotent pour un même score (elle n'écrase que sur un score strictement
    // supérieur), donc un second passage de cet effet en StrictMode est sans conséquence.
    saveBest(settings, total);
  }, [settings, total]);

  // Contrairement à `saveBest`, `recordSoloGame` n'est PAS idempotent : chaque appel AJOUTE
  // une entrée à l'historique. Un second passage de cet effet en StrictMode dupliquerait donc
  // la partie et fausserait toutes les statistiques dérivées. La ref survit au double-passage
  // (React ne la réinitialise pas entre les deux invocations de StrictMode sur la même
  // instance de composant), ce qui garantit un enregistrement unique par partie terminée.
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordSoloGame(rounds);
  }, [rounds]);

  return (
    <section className="flex flex-col gap-5">
      <div className="pokedex-card p-6 flex flex-col items-center text-center gap-3 relative overflow-hidden">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.gameOverTitle}</h1>
        <p className="mono text-5xl font-black glow-yellow" style={{ color: "var(--accent)" }}>
          {total} / {rounds.length * MAX_SCORE}
        </p>
        {isRecord ? (
          <p
            className="text-sm font-semibold rounded-full px-3 py-1 border border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)]"
            style={{ color: "var(--success)" }}
          >
            {lang === "en"
              ? "★ New record for this configuration."
              : "★ Nouveau record pour cette configuration."}
          </p>
        ) : (
          previousBest !== null && (
            <p className="text-sm text-[var(--text-dim)]">
              {lang === "en" ? `High score: ${previousBest}` : `Votre record : ${previousBest}`}
            </p>
          )
        )}
      </div>

      {stats.roundsPlayed > 0 && (
        <div className="pokedex-card p-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-dim)]">
            <li className="flex items-center justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
              <span>{lang === "en" ? "Average difference:" : "Écart moyen :"}</span>
              <span className="mono font-bold text-[var(--text)]">
                {stats.averageGap?.toLocaleString(lang === "en" ? "en-US" : "fr-FR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
              <span>{lang === "en" ? "Exact matches:" : "Réponses exactes :"}</span>
              <span className="mono font-bold text-[var(--text)]">
                {stats.exactHits} / {stats.roundsPlayed}
              </span>
            </li>
            {stats.weakestGeneration !== null && (
              <li className="sm:col-span-2 flex items-center justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
                <span>
                  {lang === "en" ? "Generation to practice:" : "Génération à travailler :"}
                </span>
                <span className="mono font-bold text-[var(--warn)]">
                  {lang === "en"
                    ? `Generation ${stats.weakestGeneration}`
                    : `Génération ${stats.weakestGeneration}`}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="pokedex-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--text-dim)] border-b border-[var(--border)] bg-[var(--surface-2)]">
              <tr>
                <th scope="col" className="hidden sm:table-cell px-4 py-3">
                  {lang === "en" ? "Target" : "Cible"}
                </th>
                <th scope="col" className="px-4 py-3">
                  Pokémon
                </th>
                <th scope="col" className="px-4 py-3">
                  {lang === "en" ? "Answer" : "Réponse"}
                </th>
                <th scope="col" className="px-4 py-3">
                  {lang === "en" ? "Diff" : "Écart"}
                </th>
                <th scope="col" className="px-4 py-3">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="mono divide-y divide-[var(--border)]/50">
              {rounds.map((round, index) => {
                const targetPk = pokemonById(round.targetId);
                const answer = round.answerId === null ? null : tryPokemonById(round.answerId);
                const isExact = round.points === 1000;
                return (
                  <tr
                    key={`${round.targetId}-${index}`}
                    className={`transition-colors hover:bg-[var(--surface-2)]/50 ${
                      isExact ? "bg-[color-mix(in_srgb,var(--success)_5%,transparent)]" : ""
                    }`}
                  >
                    <td className="hidden sm:table-cell px-4 py-2.5 text-[var(--text-dim)]">
                      {formatPokedexNumber(round.targetId, maxId)}
                    </td>
                    <td className="px-4 py-2.5 font-semibold font-sans">{pokemonName(targetPk)}</td>
                    <td className="px-4 py-2.5">{answer ? pokemonName(answer) : "—"}</td>
                    <td className="px-4 py-2.5 text-[var(--text-dim)]">
                      {round.answerId === null ? "—" : gapBetween(round.targetId, round.answerId)}
                    </td>
                    <td
                      className="px-4 py-2.5 font-bold"
                      style={{ color: isExact ? "var(--success)" : "inherit" }}
                    >
                      {round.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Button onClick={onReplay} className="py-3.5 text-base">
        {t.playAgain}
      </Button>
    </section>
  );
}
