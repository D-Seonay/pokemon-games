import {
  type Pokemon,
  type Pool,
  normalizeName,
  pokemonOfPool,
  searchPokemon,
} from "@pkfind/shared";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "./Button.js";
import { PokemonSprite } from "./PokemonSprite.js";

type Props = {
  pool: Pool;
  disabled?: boolean;
  onSubmit: (pokemon: Pokemon) => void;
};

export function PokemonCombobox({ pool, disabled = false, onSubmit }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => searchPokemon(query, pool), [query, pool]);
  const members = useMemo(() => pokemonOfPool(pool), [pool]);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  function exactMatch(): Pokemon | null {
    const slug = normalizeName(query);
    if (slug.length === 0) return null;
    const found = members.filter((p) => p.slugFr === slug || p.slugEn === slug);
    return found.length === 1 ? found[0]! : null;
  }

  function choose(pokemon: Pokemon): void {
    setSelected(pokemon);
    setQuery(pokemon.nameFr);
    setOpen(false);
  }

  function submit(pokemon: Pokemon | null): void {
    if (!pokemon) return;
    onSubmit(pokemon);
    setQuery("");
    setSelected(null);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + delta + suggestions.length) % suggestions.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const active = suggestions[activeIndex];
      if (open && active) {
        choose(active);
        return;
      }
      if (selected) {
        submit(selected);
        return;
      }
      const match = exactMatch();
      if (match) choose(match);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      if (open) {
        setOpen(false);
        return;
      }
      setQuery("");
      setSelected(null);
    }
  }

  // L'id DOM d'une option est dérivé de son index, jamais de `pokemon.id` (le numéro
  // national) : cet id est lu par `aria-activedescendant`, un attribut accessible, et ne
  // doit donc jamais révéler la réponse.
  const activeId =
    activeIndex >= 0 && activeIndex < suggestions.length
      ? `${listId}-option-${activeIndex}`
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Nom du Pokémon"
          {...(activeId ? { "aria-activedescendant": activeId } : {})}
          autoComplete="off"
          disabled={disabled}
          value={query}
          placeholder="Nom du Pokémon…"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (!selected) {
              const match = exactMatch();
              if (match) choose(match);
            }
            setOpen(false);
          }}
          className="mono h-14 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 text-lg text-[var(--text)] font-semibold shadow-inner transition-all outline-none focus:border-[var(--accent)] focus:shadow-[0_0_18px_rgba(255,203,5,0.2)] disabled:opacity-50"
        />
        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            {suggestions.map((pokemon, index) => (
              <li
                key={pokemon.id}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(pokemon);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 transition-colors border-b border-[var(--border)]/40 last:border-b-0 ${
                  index === activeIndex
                    ? "bg-[var(--surface-elevated)] border-l-4 border-l-[var(--accent)] text-[var(--text)]"
                    : "text-[var(--text-dim)] hover:bg-[var(--surface-elevated)]/60 hover:text-[var(--text)]"
                }`}
              >
                <div className="shrink-0 p-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                  <PokemonSprite pokemon={pokemon} size={32} />
                </div>
                <span className="font-semibold text-sm">{pokemon.nameFr}</span>
                {pokemon.nameEn !== pokemon.nameFr && (
                  <span className="text-xs text-[var(--text-dim)]">({pokemon.nameEn})</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="button" disabled={disabled || !selected} onClick={() => submit(selected)}>
        Valider
      </Button>
    </div>
  );
}
