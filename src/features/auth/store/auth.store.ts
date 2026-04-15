// src/features/auth/store/auth.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authService } from "@/features/auth/services/auth.service";
import {
  adaptBackendUser,
  adaptSucursal,
  extractPlainToken,
} from "@/features/auth/adapters/auth.adapter";

import { tokenManager } from "@/shared/utils/tokenManager";
import { storageManager } from "@/shared/utils/storageManager";

import type {
  AuthUser,
  AuthState,
  LoginDto,
  RegisterDto,
  Sucursal,
  PermissionString,
  RoleName,
} from "@/shared/types/auth.types";

/**
 nos sirve para definir qué acciones y estado tiene nuestro store.
 */
interface AuthActions {
  // Auth
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;

  // Sucursal activa
  setSucursalActiva: (sucursal: Sucursal) => Promise<void>;
  syncSucursalesUsuario: () => Promise<void>;

  // Helpers de permisos (mueven lógica fuera de componentes)
  hasPermission: (permission: PermissionString) => boolean;
  hasRole: (role: RoleName | RoleName[]) => boolean;
  hasAnyPermission: (permissions: PermissionString[]) => boolean;

  // Internos
  _setLoading: (isLoading: boolean) => void;
  _setUser: (user: AuthUser | null, token: string | null) => void;
  _reset: () => void;
}
//conbinamos tipos
type AuthStore = AuthState & AuthActions;

//guardamos una promesa para no reutilizarla y evitar llamadas concurrentes a initializeAuth o logout
let initializeAuthPromise: Promise<void> | null = null;
let logoutPromise: Promise<void> | null = null;

//para verificar si el rol es super-admin, con normalización de espacios y mayúsculas " Super Admin " → "super-admin"
const isSuperAdminRole = (roleName: string) => {
  return roleName.trim().toLowerCase().replace(/\s+/g, "-") === "super-admin";
};

//para leer el usuario en sessionStorage al iniciar la app, si existe
const readCachedUser = (): AuthUser | null => {
  return storageManager.getCachedUser();
};

//
const hydrateUser = (
  backendUser: Parameters<typeof adaptBackendUser>[0],
  fallbackUser: AuthUser | null,
  preferredSucursalId?: number | null,
): AuthUser => {
  const adaptedUser = adaptBackendUser(
    backendUser,
    fallbackUser?.sessionId ?? null,
  );

  const mergedSucursales =
    adaptedUser.sucursales.length > 0
      ? adaptedUser.sucursales
      : (fallbackUser?.sucursales ?? []);

  const preferredSucursal = preferredSucursalId
    ? (mergedSucursales.find((s) => s.id === preferredSucursalId) ?? null)
    : null;

  return {
    ...adaptedUser,
    roles:
      adaptedUser.roles.length > 0
        ? adaptedUser.roles
        : (fallbackUser?.roles ?? []),
    permisos:
      adaptedUser.permisos.length > 0
        ? adaptedUser.permisos
        : (fallbackUser?.permisos ?? []),
    sucursales: mergedSucursales,
    sucursalActiva:
      preferredSucursal ??
      adaptedUser.sucursalActiva ??
      fallbackUser?.sucursalActiva ??
      null,
  };
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ESTADO INICIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthInitialized: false,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /* ── Internos ── */

      _setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),

      _setUser: (user, accessToken) =>
        set(
          () => {
            /**
             * Puente temporal para el interceptor de Axios,
             * que actualmente lee el token desde sessionStorage.
             */
            if (accessToken) {
              tokenManager.setToken(accessToken);
            } else {
              tokenManager.removeToken();
            }

            if (user) {
              storageManager.setCachedUser(user);
            } else {
              storageManager.removeCachedUser();
            }

            return {
              user,
              accessToken,
              isAuthenticated: !!user && !!accessToken,
              isAuthInitialized: true,
            };
          },
          false,
          "auth/setUser",
        ),

      _reset: () =>
        set(
          () => {
            const wasInitialized = get().isAuthInitialized;
            tokenManager.removeToken();
            storageManager.removeCachedUser();

            return {
              ...initialState,
              isAuthInitialized: wasInitialized,
            };
          },
          false,
          "auth/reset",
        ),

      /* ── Login ── */

      login: async (dto) => {
        get()._setLoading(true);
        try {
          const response = await authService.login(dto);
          const { user: backendUser, access_token, session_id } = response.data;

          const plainToken = extractPlainToken(access_token);
          tokenManager.setLoginTime();

          /**
           * Guardamos el token en memoria (Zustand).
           * El interceptor de Axios lo leerá con getState().
           * Ya NO usamos sessionStorage para el token.
           */
          get()._setUser(adaptBackendUser(backendUser, session_id), plainToken);

          /**
           * Llamamos /auth/me para obtener roles y permisos completos.
           * El interceptor ya adjunta el token porque _setUser
           * ya actualizó el store antes de esta llamada.
           */
          const meResponse = await authService.me();
          const meUser = meResponse.data;
          const fallbackUser = get().user ?? readCachedUser();

          const mergedUser = {
            ...backendUser,
            ...meUser,
            persona: meUser.persona ?? backendUser.persona,
            roles:
              (meUser.roles?.length ?? 0) > 0
                ? meUser.roles
                : backendUser.roles,
            permisos:
              (meUser.permisos?.length ?? 0) > 0
                ? meUser.permisos
                : backendUser.permisos,
            sucursales:
              (meUser.sucursales?.length ?? 0) > 0
                ? meUser.sucursales
                : backendUser.sucursales,
            current_branch: meUser.current_branch ?? backendUser.current_branch,
          };

          const fullUser = hydrateUser(mergedUser, fallbackUser);

          get()._setUser(fullUser, plainToken);
          await get().syncSucursalesUsuario();
        } finally {
          get()._setLoading(false);
        }
      },

      /* ── Register ── */

      register: async (dto) => {
        get()._setLoading(true);
        try {
          const response = await authService.register(dto);
          const { user: backendUser, access_token, session_id } = response.data;

          const plainToken = extractPlainToken(access_token);
          tokenManager.setLoginTime();
          get()._setUser(adaptBackendUser(backendUser, session_id), plainToken);
          await get().syncSucursalesUsuario();
        } finally {
          get()._setLoading(false);
        }
      },

      /* ── Logout ── */

      logout: async () => {
        if (logoutPromise) {
          return logoutPromise;
        }

        logoutPromise = (async () => {
          get()._setLoading(true);
          try {
            await authService.logout();
          } catch {
            /**
             * Si el logout falla en el backend (token ya expirado),
             * limpiamos el estado igual. El usuario debe poder salir
             * sin importar el estado del servidor.
             */
          } finally {
            get()._reset();
            get()._setLoading(false);
            logoutPromise = null;
          }
        })();

        return logoutPromise;
      },

      /* ── initializeAuth ── */

      /**
       * initializeAuth — Se llama al montar la app.
       * Intenta restaurar la sesión llamando /auth/me.
       *
       * ¿Cómo funciona sin token en memoria?
       * El interceptor de Axios tiene un fallback:
       * si no hay token en el store, lee de sessionStorage.
       * En Paso 5 dejamos ese puente exactamente para esto.
       *
       * Flujo:
       * App monta → initializeAuth() → GET /auth/me
       * Si responde 200 → restaura sesión en store
       * Si responde 401 → limpia estado → AuthGuard redirige a login
       */
      initializeAuth: async () => {
        if (get().isAuthInitialized) {
          return;
        }

        if (initializeAuthPromise) {
          return initializeAuthPromise;
        }

        /**
         * Si no hay token, no tiene sentido consultar /auth/me.
         * Esto evita bucles de llamadas cuando el usuario no está autenticado.
         */
        initializeAuthPromise = (async () => {
          const token = tokenManager.getToken();

          if (!token) {
            get()._reset();
            set({ isAuthInitialized: true }, false, "auth/setInitialized");
            return;
          }

          if (tokenManager.isSessionExpired()) {
            get()._reset();

            set({ isAuthInitialized: true }, false, "auth/setInitialized");
            return;
          }

          get()._setLoading(true);
          try {
            const meResponse = await authService.me();
            const backendUser = meResponse.data;
            const fallbackUser = get().user ?? readCachedUser();

            const hydratedUser = hydrateUser(backendUser, fallbackUser);

            get()._setUser(hydratedUser, token);
            await get().syncSucursalesUsuario();
          } catch {
            // 401/errores de sesión inválida → limpiamos completamente
            get()._reset();
          } finally {
            get()._setLoading(false);
            set({ isAuthInitialized: true }, false, "auth/setInitialized");
            initializeAuthPromise = null;
          }
        })();

        return initializeAuthPromise;
      },

      /* ── Sucursal Activa ── */

      syncSucursalesUsuario: async () => {
        const { user, accessToken } = get();
        if (!user || !accessToken) return;

        try {
          const response = await authService.getUserBranches();
          const payload = response.data;

          const sucursales = (payload.items ?? []).map((item) =>
            adaptSucursal({
              id: item.id,
              nombre: item.nombre,
              clave: item.clave,
              codigo: item.codigo,
            }),
          );

          const activeBranchId = payload.sucursal_actual;
          const sucursalActiva =
            (activeBranchId
              ? sucursales.find((s) => s.id === activeBranchId)
              : null) ??
            sucursales.find((s) => s.id === user.sucursalActiva?.id) ??
            sucursales[0] ??
            null;

          const updatedUser: AuthUser = {
            ...user,
            sucursales,
            sucursalActiva,
          };

          get()._setUser(updatedUser, accessToken);
        } catch {
          // Si falla, mantenemos el estado actual para no romper la sesión.
        }
      },

      setSucursalActiva: (sucursal) => {
        const { user } = get();
        if (!user) return Promise.resolve();
        if (user.sucursalActiva?.id === sucursal.id) return Promise.resolve();

        return (async () => {
          get()._setLoading(true);
          try {
            await authService.switchBranch(sucursal.id);

            const meResponse = await authService.me();
            const backendUser = meResponse.data;
            const fallbackUser = get().user ?? readCachedUser();
            const hydratedUser = hydrateUser(
              backendUser,
              fallbackUser,
              sucursal.id,
            );

            get()._setUser(hydratedUser, get().accessToken);
            await get().syncSucursalesUsuario();
          } finally {
            get()._setLoading(false);
          }
        })();
      },

      /* ── Helpers de permisos ── */

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;

        const isSuper = user.roles.some((r) => isSuperAdminRole(r.name));
        if (isSuper) return true;

        return user.permisos.includes(permission);
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;

        const roles = Array.isArray(role) ? role : [role];
        return user.roles.some((r) => roles.includes(r.name));
      },

      hasAnyPermission: (permissions) => {
        return permissions.some((p) => get().hasPermission(p));
      },
    }),
    { name: "AuthStore" }, // nombre en Redux DevTools
  ),
);
