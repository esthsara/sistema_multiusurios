import type { AuthUser } from "@/shared/types/auth.types";

const AUTH_USER_CACHE_KEY = "auth_user_cache";

//en este módulo centralizamos el acceso al sessionStorage para manejar el caché de usuario
const getSessionStorage = (): Storage | null => {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const storageManager = {
  getCachedUser: (): AuthUser | null => {
    try {
      const raw = getSessionStorage()?.getItem(AUTH_USER_CACHE_KEY);
      if (!raw) return null;

      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setCachedUser: (user: AuthUser): void => {
    try {
      getSessionStorage()?.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
    } catch {
      // No-op.
    }
  },

  removeCachedUser: (): void => {
    try {
      getSessionStorage()?.removeItem(AUTH_USER_CACHE_KEY);
    } catch {
      // No-op.
    }
  },
};
