// src/shared/hooks/useTheme.ts
import { useState, useEffect, useCallback } from "react";

/**
 * 'light' | 'dark' — Union Type.
 *
 * ¿Por qué no string?
 * Con string podrías escribir theme = 'azul' y TypeScript no te avisaría.
 * Con este Union Type solo existen dos valores válidos en todo el proyecto.
 */
type Theme = "light" | "dark";

const THEME_KEY = "app-theme";

/**
 * ¿Por qué useCallback en toggleTheme?
 * Evita que la función se recree en cada render.
 * Importante cuando se pasa como prop a componentes hijos.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Inicialización lazy — solo corre una vez
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;

    // Respeta la preferencia del sistema operativo
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Aplica/remueve la clase .dark en <html>
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Persiste la preferencia del usuario
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setLightTheme = useCallback(() => setTheme("light"), []);
  const setDarkTheme = useCallback(() => setTheme("dark"), []);

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  } as const;
  /**
   * 'as const' — hace el objeto readonly.
   * ¿Por qué? Garantiza que quien consuma este hook
   * no pueda mutar las propiedades accidentalmente.
   */
};
