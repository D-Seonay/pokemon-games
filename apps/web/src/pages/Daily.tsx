import {
  DAILY_SETTINGS,
  MAX_SCORE,
  TIER_EMOJI,
  dailyKey,
  dailySeed,
  shareText,
  tierOf,
} from "@pkfind/shared";
import { useEffect, useState } from "react";
import { BackLink } from "../components/BackLink.js";
import { CopyButton } from "../components/CopyButton.js";
import { PokemonCombobox } from "../components/PokemonCombobox.js";
import { RoundResult } from "../components/RoundResult.js";
import { TargetNumber } from "../components/TargetNumber.js";
import { Timer } from "../components/Timer.js";
import { useSoloGame } from "../game/useSoloGame.js";
import { useI18n } from "../i18n/I18nContext.js";
import { type DailyEntry, currentStreak, readHistory, recordDaily } from "../storage/daily.js";
import { KEYS, readJson, writeJson } from "../storage/local.js";

export function Daily() {
  // Figé une seule fois au montage : la date du jour et la graine du défi doivent provenir
  // du même instant, sinon un franchissement de minuit UTC en cours de partie ferait dériver
  // l'une par rapport à l'autre (voir DailyBoard, qui dérive sa graine de cette même valeur).
  const [now] = useState(() => new Date());
  const today = dailyKey(now);
  const [entry, setEntry] = useState<DailyEntry | null>(() => {
    const stored = readJson<DailyEntry | null>(KEYS.daily, null);
    return stored && stored.date === today ? stored : null;
  });

  if (entry) return <DailyResult entry={entry} today={today} />;
  return <DailyBoard now={now} onFinish={setEntry} today={today} />;
}

function DailyBoard({
  today,
  now,
  onFinish,
}: {
  today: string;
  now: Date;
  onFinish: (entry: DailyEntry) => void;
}) {
  const { lang, t } = useI18n();
  const game = useSoloGame(DAILY_SETTINGS, dailySeed(now));

  useEffect(() => {
    if (game.phase !== "finished") return;
    const result: DailyEntry = {
      date: today,
      total: game.totalScore,
      points: game.rounds.map((round) => round.points),
    };
    writeJson(KEYS.daily, result);
    recordDaily(result);
    onFinish(result);
  }, [game.phase, game.rounds, game.totalScore, onFinish, today]);

  if (game.phase === "finished") return null;

  const lastRound = game.rounds[game.rounds.length - 1];

  return (
    <section className="flex flex-col gap-4">
      <header className="pokedex-card flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-extrabold tracking-tight">
          {lang === "en" ? `Daily Challenge — ${today}` : `Défi du jour — ${today}`}
        </h1>
        <p className="mono font-bold text-base text-[var(--accent)] glow-yellow">
          {game.totalScore} {t.pts}
        </p>
      </header>
      <p className="mono text-sm text-[var(--text-dim)]">
        {t.roundIndicator(game.roundIndex + 1, game.roundCount)} ·{" "}
        {lang === "en" ? "National Pokédex" : "Pokédex national"}
      </p>
      {game.phase === "round" ? (
        <>
          <Timer remainingMs={game.remainingMs} totalMs={DAILY_SETTINGS.roundDurationMs} />
          <TargetNumber id={game.targetId} maxId={game.pool.maxId} />
          <PokemonCombobox pool={game.pool} onSubmit={(pokemon) => game.answer(pokemon.id)} />
        </>
      ) : (
        lastRound && <RoundResult round={lastRound} pool={game.pool} onSkip={game.skipReveal} />
      )}
    </section>
  );
}

function DailyResult({ entry }: { entry: DailyEntry; today: string }) {
  const { lang } = useI18n();
  // Lu une seule fois : l'historique ne bouge plus une fois la partie du jour terminée.
  const [history] = useState(readHistory);
  const streak = currentStreak(history, entry.date);
  const emojis = entry.points.map((points) => TIER_EMOJI[tierOf(points)]).join("");
  const max = entry.points.length * MAX_SCORE;

  // Calculé au rendu plutôt que dans un gestionnaire : `CopyButton` reçoit la valeur et se
  // charge du reste, y compris de dire ce qui s'est passé. L'ancienne version ouvrait un
  // `window.prompt` en cas d'échec — une boîte modale bloquante pour un simple partage.
  const summary = shareText({
    date: new Date(`${entry.date}T12:00:00Z`),
    total: entry.total,
    points: entry.points,
    url: `${window.location.origin}/daily`,
  });

  return (
    <section className="flex flex-col gap-4 text-center">
      <BackLink />
      <div className="pokedex-card p-6 flex flex-col items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {lang === "en" ? `Daily Challenge — ${entry.date}` : `Défi du jour — ${entry.date}`}
        </h1>
        <p className="mono text-5xl font-black glow-yellow" style={{ color: "var(--accent)" }}>
          {entry.total.toLocaleString(lang === "en" ? "en-US" : "fr-FR")} /{" "}
          {max.toLocaleString(lang === "en" ? "en-US" : "fr-FR")}
        </p>
        <p className="text-3xl tracking-widest">{emojis}</p>
        {streak > 0 && (
          <p className="text-[var(--text-dim)] text-sm">
            <span className="mono font-bold text-[var(--accent)]">{streak}</span>{" "}
            {lang === "en"
              ? streak === 1
                ? "day streak"
                : "days streak"
              : streak === 1
                ? "jour d'affilée"
                : "jours d'affilée"}
          </p>
        )}
      </div>

      {history.length > 1 && (
        <div className="pokedex-card p-4 flex flex-col items-center gap-2">
          <p className="text-xs uppercase font-semibold text-[var(--text-dim)]">
            {lang === "en" ? "Recent History" : "Historique récent"}
          </p>
          <ul
            className="flex flex-wrap justify-center gap-1.5"
            aria-label={lang === "en" ? "Last thirty days" : "Trente derniers jours"}
          >
            {history.map((day) => (
              <li
                key={day.date}
                title={`${day.date} — ${day.total.toLocaleString(lang === "en" ? "en-US" : "fr-FR")}`}
                className="text-lg leading-none p-1 rounded hover:bg-[var(--surface-2)] transition-colors"
              >
                {TIER_EMOJI[tierOf(Math.round(day.total / Math.max(1, day.points.length)))]}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CopyButton value={summary} label={lang === "en" ? "Share result" : "Partager le résultat"} />
      <p className="text-sm text-[var(--text-dim)]">
        {lang === "en"
          ? "Come back tomorrow for a new challenge."
          : "Reviens demain pour un nouveau défi."}
      </p>
    </section>
  );
}
