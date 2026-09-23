import type { Standing } from "@pkfind/shared";

export function Scoreboard({
  standings,
  highlightPlayerId,
}: {
  standings: Standing[];
  highlightPlayerId?: string;
}) {
  return (
    <div className="pokedex-card w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-xs uppercase font-semibold tracking-wider text-[var(--text-dim)]">
            <tr>
              <th scope="col" className="px-4 py-3">Rang</th>
              <th scope="col" className="px-4 py-3">Joueur</th>
              <th scope="col" className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="mono divide-y divide-[var(--border)]/50">
            {standings.map((standing) => {
              const isSelf = standing.playerId === highlightPlayerId;
              return (
                <tr
                  key={standing.playerId}
                  data-self={isSelf ? "true" : undefined}
                  className={`transition-colors ${
                    isSelf
                      ? "bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] font-bold text-[var(--accent)]"
                      : "hover:bg-[var(--surface-2)]/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      {standing.rank === 1 && <span className="select-none" aria-hidden="true">🥇</span>}
                      {standing.rank === 2 && <span className="select-none" aria-hidden="true">🥈</span>}
                      {standing.rank === 3 && <span className="select-none" aria-hidden="true">🥉</span>}
                      {standing.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{standing.nickname}</td>
                  <td className="px-4 py-3 text-right font-bold">{standing.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
