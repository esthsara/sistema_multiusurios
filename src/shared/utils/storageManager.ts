import type { AuthUser } from "@/shared/types/auth.types";

const AUTH_USER_CACHE_KEY = "auth_user_cache";
const SUCURSAL_ACTIVA_KEY = "sucursal_activa_id";

const getSessionStorage = (): Storage | null => {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const storageManager = {
  getSucursalId: (): string | null => {
    try {
      return getSessionStorage()?.getItem(SUCURSAL_ACTIVA_KEY) ?? null;
    } catch {
      return null;
    }
  },

  setSucursalId: (id: string): void => {
    try {
      getSessionStorage()?.setItem(SUCURSAL_ACTIVA_KEY, id);
    } catch {
      // No-op.
    }
  },

  removeSucursalId: (): void => {
    try {
      getSessionStorage()?.removeItem(SUCURSAL_ACTIVA_KEY);
    } catch {
      // No-op.
    }
  },

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
