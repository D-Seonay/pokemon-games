import type { Pokemon, PokemonDetail } from "@pkfind/shared";
import { PokemonSprite } from "../components/PokemonSprite.js";
import { formatPokedexNumber } from "../format.js";
import { TypeBadge } from "./TypeBadge.js";

export function PokedexCard({
  pokemon,
  detail,
  maxId,
  onOpen,
}: {
  pokemon: Pokemon;
  /** `undefined` tant que le fichier de détails n'est pas arrivé : la carte reste utile sans. */
  detail: PokemonDetail | undefined;
  maxId: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${pokemon.nameFr}, voir la fiche`}
      className="pokedex-card group relative flex flex-col items-center gap-1.5 p-3.5 text-center cursor-pointer transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6),0_0_15px_rgba(255,203,5,0.15)] focus-visible:border-[var(--accent)] active:scale-[0.98] outline-none"
    >
      <span className="mono text-xs font-semibold text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors">
        {formatPokedexNumber(pokemon.id, maxId)}
      </span>
      <div className="relative py-1 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <PokemonSprite pokemon={pokemon} size={72} />
      </div>
      <span className="text-sm font-bold leading-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
        {pokemon.nameFr}
      </span>
      {pokemon.nameEn !== pokemon.nameFr && (
        <span className="text-xs leading-tight text-[var(--text-dim)] font-medium">
          {pokemon.nameEn}
        </span>
      )}
      {detail && (
        <span className="flex flex-wrap justify-center gap-1 mt-1">
          {detail.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </span>
      )}
    </button>
  );
}
