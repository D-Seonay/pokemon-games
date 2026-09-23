import { isCodeChar, isValidRoomCode, sanitizeRoomCodeInput } from "@pkfind/shared";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackLink } from "../components/BackLink.js";
import { Button } from "../components/Button.js";
import { KEYS, readJson, writeJson } from "../storage/local.js";

export function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  // Un caractère écarté qui disparaît sans un mot laisse le joueur croire que son clavier
  // ne répond pas. Le cas courant n'est pas malveillant : on lui dicte un code, il entend
  // « O » et tape la lettre, absente de l'alphabet.
  const [rejected, setRejected] = useState(false);
  const [nickname, setNickname] = useState(() => readJson(KEYS.nickname, ""));

  return (
    <section className="flex flex-col gap-5">
      <BackLink />
      <h1 className="text-3xl font-extrabold tracking-tight">Rejoindre une room</h1>

      <div className="pokedex-card p-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Code de la room
          </span>
          <input
            value={code}
            // Pas de `maxLength` : il tronquerait la saisie BRUTE avant nettoyage, et un
            // code collé avec des espaces (« ␣␣ab23␣␣ ») perdrait ses derniers caractères.
            // La longueur est imposée par `sanitizeRoomCodeInput`, à un seul endroit.
            aria-label="Code de la room"
            placeholder="ABCD"
            onChange={(event) => {
              const raw = event.target.value;
              setCode(sanitizeRoomCodeInput(raw));
              // Les espaces ne comptent pas : coller un code entouré d'espaces est normal,
              // et n'a pas à déclencher un avertissement.
              const dropped = [...raw.toUpperCase().replace(/\s+/g, "")].filter(
                (char) => !isCodeChar(char),
              );
              setRejected(dropped.length > 0);
            }}
            className="mono h-16 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-4 text-center text-3xl font-bold tracking-[0.3em] sm:text-4xl sm:tracking-[0.4em] uppercase text-[var(--accent)] glow-yellow outline-none focus:border-[var(--accent)] transition-all shadow-inner"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Ton pseudo
          </span>
          <input
            value={nickname}
            maxLength={16}
            aria-label="Ton pseudo"
            placeholder="Sacha"
            onChange={(event) => setNickname(event.target.value)}
            className="h-12 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-4 font-semibold text-[var(--text)] outline-none focus:border-[var(--accent-2)] transition-all"
          />
        </label>

        {rejected && (
          <p role="status" className="text-xs font-medium rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warn)_10%,transparent)] border border-[var(--warn)]/40 p-2.5" style={{ color: "var(--warn)" }}>
            Les codes ne contiennent ni I, ni O, ni 0, ni 1 — pour éviter les confusions quand on se
            les dicte.
          </p>
        )}

        <Button
          disabled={!isValidRoomCode(code) || nickname.trim().length < 2}
          onClick={() => {
            writeJson(KEYS.nickname, nickname.trim());
            navigate(`/room/${code}`);
          }}
          className="py-3.5 text-base mt-2"
        >
          Rejoindre
        </Button>
      </div>
    </section>
  );
}
