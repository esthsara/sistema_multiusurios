// src/shared/utils/tokenManager.ts

const ACCESS_TOKEN_KEY = "access_token";
const LOGIN_TIME_KEY = "login_time";

// Duración de la sesión — configurable desde .env
const DEFAULT_SESSION_MAX_AGE_MS = Number(import.meta.env.VITE_SESSION_MAX_AGE_MS) || 2 * 60 * 60 * 1000; // 2 horas*/

export const tokenManager = {
  // Devuelve el token guardado en sessionStorage o null si no existe
  getToken: (): string | null => {
    try {
      return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // Guarda el token en sessionStorage (fallback para refresh de página)
  setToken: (token: string) => {
    try {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      // SSR guard
    }
  },

  // Guarda la marca de tiempo del login para controlar expiración por UX
  setLoginTime: (timestamp: number = Date.now()) => {
    try {
      sessionStorage.setItem(LOGIN_TIME_KEY, String(timestamp));
    } catch {
      // SSR guard
    }
  },

  // Devuelve la hora del login como número, o null si no existe
  getLoginTime: (): number | null => {
    try {
      const raw = sessionStorage.getItem(LOGIN_TIME_KEY);
      if (!raw) return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  // Elimina la marca de tiempo del login
  removeLoginTime: () => {
    try {
      sessionStorage.removeItem(LOGIN_TIME_KEY);
    } catch {
      // SSR guard
    }
  },

  /**
   * Determina si la sesión local ha expirado por tiempo.
   *
   * COMPORTAMIENTO CLAVE:
   * - Sin token         → true  (expirado — no hay nada que restaurar)
   * - Con token, sin loginTime → false (dejar pasar a /auth/me para que el
   *   backend decida). Esto evita el logout en refresh cuando sessionStorage
   *   perdió el timestamp pero el token JWT sigue siendo válido.
   * - Con token y loginTime → comparar tiempo transcurrido
   */
  isSessionExpired: (
    maxAgeMs: number = DEFAULT_SESSION_MAX_AGE_MS,
  ): boolean => {
    const token = tokenManager.getToken();
    if (!token) return true;

    const loginTime = tokenManager.getLoginTime();
    // Sin loginTime no podemos saber — dejamos que /auth/me lo determine
    if (!loginTime) return false;

    return Date.now() - loginTime >= maxAgeMs;
  },

  /**
   * Milisegundos restantes hasta la expiración de la sesión por tiempo local.
   * Retorna null si no hay información de loginTime (no se puede calcular).
   * Útil para mostrar el aviso de "tu sesión expira en X minutos".
   */
  getRemainingMs: (
    maxAgeMs: number = DEFAULT_SESSION_MAX_AGE_MS,
  ): number | null => {
    const loginTime = tokenManager.getLoginTime();
    if (!loginTime) return null;
    const remaining = maxAgeMs - (Date.now() - loginTime);
    return remaining > 0 ? remaining : 0;
  },

  // Elimina token y loginTime del sessionStorage (logout completo)
  removeToken: () => {
    try {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(LOGIN_TIME_KEY);
    } catch {
      // SSR guard
    }
  },
};
