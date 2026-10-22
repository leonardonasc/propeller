"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const themes = [
  { id: "night", label: "Noturno", swatch: "#2563eb" },
  { id: "light", label: "Claro", swatch: "#4f46e5" },
  { id: "dark", label: "Dark mode", swatch: "#080d1a" },
  { id: "dracula", label: "Drácula", swatch: "#bd93f9" },
] as const;

type ThemeId = (typeof themes)[number]["id"];
const STORAGE_KEY = "propeller-theme";

function applyTheme(theme: ThemeId) {
  document.getElementById("main-app")?.setAttribute("data-theme", theme);
}

export function ThemePicker() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("night");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const theme = themes.some((option) => option.id === storedTheme)
      ? storedTheme!
      : "night";

    setSelectedTheme(theme);
    applyTheme(theme);
  }, []);

  function selectTheme(theme: ThemeId) {
    setSelectedTheme(theme);
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }

  return (
    <section aria-label="Tema do aplicativo" className="px-3 py-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        Aparência
      </p>
      <div className="grid grid-cols-4 gap-2">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              title={theme.label}
              aria-label={`Usar tema ${theme.label}`}
              aria-pressed={isSelected}
              onClick={() => selectTheme(theme.id)}
              className={`grid size-9 place-items-center rounded-lg border transition hover:-translate-y-0.5 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/60"
              }`}
              style={{ backgroundColor: theme.swatch }}
            >
              {isSelected && <Check size={15} className="text-white drop-shadow" />}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {themes.find((theme) => theme.id === selectedTheme)?.label}
      </p>
    </section>
  );
}

export function ThemeInitializer() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const theme = themes.some((option) => option.id === storedTheme) ? storedTheme! : "night";
    applyTheme(theme);
  }, []);

  return null;
}
