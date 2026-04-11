// src/shared/utils/tokenManager.ts

const ACCESS_TOKEN_KEY = "access_token";
const LOGIN_TIME_KEY = "login_time";

//cuanti dura la sesion 
const DEFAULT_SESSION_MAX_AGE_MS =
  Number(import.meta.env.VITE_SESSION_MAX_AGE_MS) || 2 * 60 * 60 * 1000; // 2 horas

//devuelve token guardado en sessionStorage o null si no existe o hay error
export const tokenManager = {
  getToken: (): string | null => {
    try {
      return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  //guarda token en sessionStorage
  setToken: (token: string) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  //guardala hora del login para controlar expiración de sesión
  setLoginTime: (timestamp: number = Date.now()) => {
    sessionStorage.setItem(LOGIN_TIME_KEY, String(timestamp));
  },
  //devuelve la hora del login lo conevierte en numero  o null si no existe o hay error
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

  //elimina la hora del login del sessionStorage
  removeLoginTime: () => {
    sessionStorage.removeItem(LOGIN_TIME_KEY);
  },

  isSessionExpired: (
    maxAgeMs: number = DEFAULT_SESSION_MAX_AGE_MS,
  ): boolean => {
    const token = tokenManager.getToken();
    if (!token) return true;

    const loginTime = tokenManager.getLoginTime();
    if (!loginTime) return true;

    const elapsed = Date.now() - loginTime;
    return elapsed >= maxAgeMs;
  },

  removeToken: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(LOGIN_TIME_KEY);
  },
};
