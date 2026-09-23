import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.js";

/**
 * Le retour, en tête d'écran. Il était auparavant en bas de page : sur le Pokédex, il
 * fallait faire défiler un millier de fiches pour le trouver. Au-delà du confort, c'est
 * aussi le premier élément focalisable de la page, donc celui qu'une tabulation atteint
 * en premier — ce qu'on attend d'une commande de retour.
 */
export function BackLink({ to = "/", label }: { to?: string; label?: string }) {
  const { t } = useI18n();
  const displayLabel = label ?? t.errorBoundaryReturn;

  return (
    <Link
      to={to}
      className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)] transition-all shadow-sm active:scale-[0.98]"
    >
      <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      {displayLabel}
    </Link>
  );
}
