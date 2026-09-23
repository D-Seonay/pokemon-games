import type { ErrorCode, Pokemon } from "@pkfind/shared";
import { ERROR_MESSAGES_EN, ERROR_MESSAGES_FR } from "@pkfind/shared";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { KEYS, readJson, writeJson } from "../storage/local.js";
import { en } from "./translations/en.js";
import { fr } from "./translations/fr.js";
import type { Language, Translations } from "./types.js";

interface I18nContextValue {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  pokemonName: (pokemon: Pick<Pokemon, "nameFr" | "nameEn">) => string;
  errorMessage: (code: ErrorCode) => string;
}

const dictionaries: Record<Language, Translations> = { fr, en };

const I18nContext = createContext<I18nContextValue>({
  lang: "fr",
  setLanguage: () => {},
  t: fr,
  pokemonName: (p) => p.nameFr,
  errorMessage: (code) => ERROR_MESSAGES_FR[code] ?? code,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = readJson<string>(KEYS.language, "");
    if (saved === "en" || saved === "fr") return saved;
    return "fr";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    writeJson(KEYS.language, newLang);
  };

  const t = dictionaries[lang] ?? fr;

  const pokemonName = (pokemon: Pick<Pokemon, "nameFr" | "nameEn">): string => {
    return lang === "en" ? pokemon.nameEn : pokemon.nameFr;
  };

  const errorMessage = (code: ErrorCode): string => {
    const dict = lang === "en" ? ERROR_MESSAGES_EN : ERROR_MESSAGES_FR;
    return dict[code] ?? code;
  };

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t, pokemonName, errorMessage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
