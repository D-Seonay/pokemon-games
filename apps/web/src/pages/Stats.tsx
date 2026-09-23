import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BackLink } from "../components/BackLink.js";
import {
  MIN_GENERATION_SAMPLE,
  computeStats,
  generationBreakdown,
  readSoloHistory,
} from "../storage/stats.js";

function formatGap(value: number): string {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function Stats() {
  // Lu une seule fois au montage : rien ici n'écrit dans le stockage, mais l'initialiseur
  // paresseux garde la lecture hors du corps du composant, où elle serait rejouée à chaque
  // rendu sans raison.
  const [history] = useState(() => readSoloHistory());

  const stats = useMemo(() => computeStats(history), [history]);
  const rows = useMemo(() => generationBreakdown(history), [history]);

  if (history.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <BackLink />
        <h1 className="text-3xl font-extrabold tracking-tight">Statistiques</h1>
        <div className="pokedex-card p-6 flex flex-col gap-3">
          <p className="text-[var(--text-dim)]">
            Aucune partie solo terminée pour l'instant. Vos écarts et vos réponses exactes
            s'accumuleront ici au fil des parties.
          </p>
          <Link
            to="/solo"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[#0a0c12] shadow-sm hover:bg-[#ffd833] transition-colors"
          >
            Jouer une partie
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <BackLink />
      <h1 className="text-3xl font-extrabold tracking-tight">Statistiques</h1>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="pokedex-card p-4 flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Parties
          </dt>
          <dd className="mono text-3xl font-bold text-[var(--text)]">{history.length}</dd>
        </div>
        <div className="pokedex-card p-4 flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Manches répondues
          </dt>
          <dd className="mono text-3xl font-bold text-[var(--text)]">{stats.roundsPlayed}</dd>
        </div>
        <div className="pokedex-card p-4 flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Écart moyen
          </dt>
          <dd className="mono text-3xl font-bold text-[var(--accent)] glow-yellow">
            {stats.averageGap === null ? "—" : formatGap(stats.averageGap)}
          </dd>
        </div>
        <div className="pokedex-card p-4 flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Réponses exactes
          </dt>
          <dd className="mono text-3xl font-bold text-[var(--success)]">
            {stats.exactHits}
          </dd>
        </div>
      </dl>

      {stats.weakestGeneration !== null && (
        <div className="pokedex-card p-4 flex items-center gap-3 border-[color-mix(in_srgb,var(--warn)_40%,transparent)] bg-[color-mix(in_srgb,var(--warn)_8%,transparent)]">
          <span className="text-2xl select-none" aria-hidden="true">⚠️</span>
          <p className="text-sm">
            Génération à travailler :{" "}
            <strong className="mono font-bold text-[var(--warn)]">
              Génération {stats.weakestGeneration}
            </strong>
          </p>
        </div>
      )}

      <div className="pokedex-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Écart moyen par génération</caption>
            <thead className="text-[var(--text-dim)] border-b border-[var(--border)] bg-[var(--surface-2)]">
              <tr>
                <th scope="col" className="px-4 py-3">Génération</th>
                <th scope="col" className="px-4 py-3">Manches</th>
                <th scope="col" className="px-4 py-3">Écart moyen</th>
              </tr>
            </thead>
            <tbody className="mono divide-y divide-[var(--border)]/50">
              {rows.map((row) => (
                <tr key={row.generation} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                  <th scope="row" className="font-normal px-4 py-2.5">
                    Génération {row.generation}
                  </th>
                  <td className="px-4 py-2.5 text-[var(--text-dim)]">{row.roundsPlayed}</td>
                  <td className="px-4 py-2.5 font-bold">
                    {formatGap(row.averageGap)}
                    {!row.significant && (
                      <span className="ml-2 text-xs font-normal text-[var(--text-dim)]">
                        (moins de {MIN_GENERATION_SAMPLE} manches)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[var(--text-dim)]">
        Une génération n'est désignée comme la plus faible qu'à partir de {MIN_GENERATION_SAMPLE}{" "}
        manches jouées : en dessous, l'écart ne prouve rien.
      </p>
    </section>
  );
}
