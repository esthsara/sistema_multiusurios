// src/shared/hooks/useTheme.ts
import { useCallback, useSyncExternalStore } from "react";

/** Tema de la aplicación: 'light' o 'dark'. */
type Theme = "light" | "dark";

const THEME_KEY = "app-theme";

const isBrowser = typeof window !== "undefined";

const getPreferredTheme = (): Theme => {
  if (!isBrowser) return "light";

  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

let currentTheme: Theme = getPreferredTheme();
const listeners = new Set<() => void>();

const applyTheme = (theme: Theme) => {
  if (!isBrowser) return;

  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
};

const setGlobalTheme = (nextTheme: Theme) => {
  if (currentTheme === nextTheme) return;
  currentTheme = nextTheme;
  applyTheme(currentTheme);
  listeners.forEach((listener) => listener());
};

applyTheme(currentTheme);

export const useTheme = () => {
  const theme = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => currentTheme,
    () => "light",
  );

  const toggleTheme = useCallback(() => {
    setGlobalTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  const setLightTheme = useCallback(() => {
    setGlobalTheme("light");
  }, []);

  const setDarkTheme = useCallback(() => {
    setGlobalTheme("dark");
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  } as const;
};
