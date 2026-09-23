import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { KEYS } from "../storage/local.js";
import { I18nProvider, useI18n } from "./I18nContext.js";

function TestConsumer() {
  const { lang, setLanguage, t, pokemonName, errorMessage } = useI18n();

  return (
    <div>
      <span data-testid="current-lang">{lang}</span>
      <span data-testid="classic-title">{t.classicTitle}</span>
      <span data-testid="classic-badge">{t.classicBadge}</span>
      <span data-testid="bulba-name">
        {pokemonName({ nameFr: "Bulbizarre", nameEn: "Bulbasaur" })}
      </span>
      <span data-testid="err-msg">{errorMessage("ROOM_NOT_FOUND")}</span>
      <button onClick={() => setLanguage("en")}>Set EN</button>
      <button onClick={() => setLanguage("fr")}>Set FR</button>
    </div>
  );
}

describe("i18n (Internationalization)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "fr";
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("fournit le français par défaut et traduit les Pokémon et erreurs", () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>,
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("fr");
    expect(screen.getByTestId("classic-title")).toHaveTextContent("Trouver le numéro");
    expect(screen.getByTestId("classic-badge")).toHaveTextContent("Classique");
    expect(screen.getByTestId("bulba-name")).toHaveTextContent("Bulbizarre");
    expect(screen.getByTestId("err-msg")).toHaveTextContent("Cette room n'existe pas ou plus.");
  });

  it("permet de basculer en anglais", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Set EN" }));

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("classic-title")).toHaveTextContent("Find the Number");
    expect(screen.getByTestId("classic-badge")).toHaveTextContent("Classic");
    expect(screen.getByTestId("bulba-name")).toHaveTextContent("Bulbasaur");
    expect(screen.getByTestId("err-msg")).toHaveTextContent(
      "This room does not exist or has expired.",
    );
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem(KEYS.language)).toBe(JSON.stringify("en"));
  });

  it("persiste et restaure la langue depuis localStorage", () => {
    localStorage.setItem(KEYS.language, JSON.stringify("en"));

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>,
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("classic-badge")).toHaveTextContent("Classic");
  });
});
