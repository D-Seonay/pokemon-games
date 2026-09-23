import { useI18n } from "../i18n/I18nContext.js";

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, setLanguage } = useI18n();

  return (
    <div
      role="group"
      aria-label={lang === "fr" ? "Choix de la langue" : "Language selection"}
      className={`inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs font-bold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        aria-pressed={lang === "fr"}
        className={`rounded-full px-2.5 py-1 transition-all flex items-center gap-1 cursor-pointer ${
          lang === "fr"
            ? "bg-[var(--accent)] text-[#0a0c12] shadow-[0_0_8px_rgba(255,203,5,0.4)]"
            : "text-[var(--text-dim)] hover:text-[var(--text)]"
        }`}
      >
        <span aria-hidden="true">🇫🇷</span>
        <span>FR</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-all flex items-center gap-1 cursor-pointer ${
          lang === "en"
            ? "bg-[var(--accent-2)] text-white shadow-[0_0_8px_rgba(61,123,255,0.4)]"
            : "text-[var(--text-dim)] hover:text-[var(--text)]"
        }`}
      >
        <span aria-hidden="true">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
