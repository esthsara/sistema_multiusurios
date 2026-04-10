// src/shared/utils/tokenManager.ts

const ACCESS_TOKEN_KEY = "access_token";
const LOGIN_TIME_KEY = "login_time";

const DEFAULT_SESSION_MAX_AGE_MS =
  Number(import.meta.env.VITE_SESSION_MAX_AGE_MS) || 2 * 60 * 60 * 1000; // 2 horas

export const tokenManager = {
  getToken: (): string | null => {
    try {
      return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string) => {
    try {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      // No-op: mantenemos el comportamiento silencioso del frontend.
    }
  },

  setLoginTime: (timestamp: number = Date.now()) => {
    try {
      sessionStorage.setItem(LOGIN_TIME_KEY, String(timestamp));
    } catch {
      // No-op.
    }
  },

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

  removeLoginTime: () => {
    try {
      sessionStorage.removeItem(LOGIN_TIME_KEY);
    } catch {
      // No-op.
    }
  },

  isSessionExpired: (
    maxAgeMs: number = DEFAULT_SESSION_MAX_AGE_MS,
  ): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;

    const loginTime = tokenManager.getLoginTime();
    if (!loginTime) return true;

    const elapsed = Date.now() - loginTime;
    return elapsed >= maxAgeMs;
  },

  removeToken: () => {
    try {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(LOGIN_TIME_KEY);
    } catch {
      // No-op.
    }
  },
};
