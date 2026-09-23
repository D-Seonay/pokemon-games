import type { GameMode } from "@pkfind/shared";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.js";
import { KEYS, readJson, writeJson } from "../storage/local.js";

/**
 * Une carte par jeu, et dans chacune le choix seul ou à plusieurs.
 *
 * La liste plate d'origine mêlait deux questions sans le dire : à quel jeu on joue, et
 * avec qui. « Jouer en solo » et « Contre la montre » étaient tous deux du solo, et
 * « Créer une room » ne disait pas à quel jeu elle servirait.
 */
function GameCard({
  title,
  description,
  badge,
  badgeColor,
  icon,
  soloPath,
  mode,
  extra,
  go,
}: {
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: string;
  soloPath: string;
  mode: GameMode;
  extra?: { label: string; path: string };
  go: (path: string, state?: { mode: GameMode }) => void;
}) {
  return (
    <section className="pokedex-card flex flex-col gap-4 p-5 sm:p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 border"
              style={{
                color: badgeColor,
                borderColor: `color-mix(in srgb, ${badgeColor} 40%, transparent)`,
                background: `color-mix(in srgb, ${badgeColor} 12%, transparent)`,
              }}
            >
              {badge}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            {title}
          </h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">{description}</p>
        </div>
        <span
          aria-hidden="true"
          className="text-3xl sm:text-4xl p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] select-none shrink-0"
        >
          {icon}
        </span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
        <Button onClick={() => go(soloPath)} className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="text-xs">▶</span>
          Solo
        </Button>
        {/* Le mode voyage avec la navigation : la room s'ouvre déjà réglée sur ce jeu,
            au lieu de laisser l'hôte le choisir une seconde fois dans le lobby. */}
        <Button variant="ghost" onClick={() => go("/room/new", { mode })} className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="text-xs opacity-75">👥</span>
          Multijoueur
        </Button>
        {extra && (
          <Button
            variant="ghost"
            className="sm:col-span-2 border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--text)] flex items-center justify-center gap-2"
            onClick={() => go(extra.path)}
          >
            <span aria-hidden="true" className="text-[var(--accent)]">★</span>
            {extra.label}
          </Button>
        )}
      </div>
    </section>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(() => readJson(KEYS.nickname, ""));
  const nicknameInputId = useId();

  function go(path: string, state?: { mode: GameMode }): void {
    writeJson(KEYS.nickname, nickname.trim());
    navigate(path, state ? { state } : {});
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Brand Header */}
      <header className="flex flex-col gap-2 pt-2">
        <div className="flex items-center gap-3">
          {/* Stylized Pokéball Logo */}
          <div
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface-2)] shadow-[0_0_15px_rgba(255,203,5,0.2)] shrink-0 select-none relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-[var(--accent-red)] opacity-90" />
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[var(--surface-elevated)]" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-[#0a0c12]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#0a0c12] flex items-center justify-center border border-[var(--border)]">
              <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_4px_white]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--text)] bg-clip-text text-transparent">
              Pokémon Find
            </h1>
          </div>
        </div>
        <p className="text-[var(--text-dim)] flex items-center gap-2 text-sm sm:text-base">
          <span>Deux jeux de mémoire Pokédex, seul ou entre amis.</span>
          <span className="hidden sm:inline-block text-xs font-mono rounded-full px-2 py-0.5 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)]">
            Gén 1 à 9
          </span>
        </p>
      </header>

      {/* Trainer profile input card */}
      <div className="pokedex-card p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor={nicknameInputId} className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Ton pseudo
          </label>
          {nickname.trim().length > 0 && (
            <span className="text-xs text-[var(--success)] flex items-center gap-1 font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)] shadow-[0_0_6px_var(--success)]" />
              Prêt à jouer
            </span>
          )}
        </div>
        <input
          id={nicknameInputId}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={16}
          placeholder="Sacha"
          className="h-12 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-4 text-[var(--text)] font-semibold placeholder:text-[var(--text-dim)]/50 focus:border-[var(--accent-2)] focus:shadow-[0_0_15px_rgba(61,123,255,0.25)] transition-all outline-none"
        />
      </div>

      {/* Game Modes */}
      <div className="flex flex-col gap-4">
        <GameCard
          title="Trouver le numéro"
          description="Un numéro du Pokédex s'affiche. Nomme le Pokémon, ou approche-toi le plus possible."
          badge="Précision & Déduction"
          badgeColor="var(--accent)"
          icon="🎯"
          soloPath="/solo"
          mode="classic"
          extra={{ label: "Défi du jour", path: "/daily" }}
          go={go}
        />

        <GameCard
          title="Contre la montre"
          description="Nomme le plus de Pokémon possible avant la fin du temps."
          badge="Sprint Chronométré"
          badgeColor="var(--accent-2)"
          icon="⚡"
          soloPath="/blitz"
          mode="blitz"
          go={go}
        />
      </div>

      {/* Bottom utility links */}
      <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
        <Button
          variant="ghost"
          onClick={() => go("/join")}
          className="flex items-center justify-center gap-2 py-3.5"
        >
          <span aria-hidden="true" className="text-sm">🔑</span>
          Rejoindre une room
        </Button>
        <Button
          variant="ghost"
          onClick={() => go("/pokedex")}
          className="flex items-center justify-center gap-2 py-3.5"
        >
          <span aria-hidden="true" className="text-sm">📖</span>
          Pokédex
        </Button>
        <Button
          variant="ghost"
          onClick={() => go("/stats")}
          className="flex items-center justify-center gap-2 py-3.5"
        >
          <span aria-hidden="true" className="text-sm">📊</span>
          Statistiques
        </Button>
      </div>
    </section>
  );
}
