// src/features/auth/store/auth.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authService } from "@/features/auth/services/auth.service";
import {
  adaptBackendUser,
  extractPlainToken,
} from "@/features/auth/adapters/auth.adapter";
import type {
  AuthUser,
  AuthState,
  LoginDto,
  RegisterDto,
  Sucursal,
  PermissionString,
  RoleName,
} from "@/shared/types/auth.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIPOS DEL STORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 nos sirve para definir claramente qué acciones y estado tiene nuestro store.

 */
interface AuthActions {
  // Auth
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;

  // Sucursal
  setSucursalActiva: (sucursal: Sucursal) => void;

  // Helpers de permisos (mueven lógica fuera de componentes)
  hasPermission: (permission: PermissionString) => boolean;
  hasRole: (role: RoleName | RoleName[]) => boolean;
  hasAnyPermission: (permissions: PermissionString[]) => boolean;

  // Internos
  _setLoading: (isLoading: boolean) => void;
  _setUser: (user: AuthUser | null, token: string | null) => void;
  _reset: () => void;
}

/**
 * AuthStore — Intersección de State + Actions.
 * Intersección (&): el store tiene AMBAS formas.
 */
type AuthStore = AuthState & AuthActions;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ESTADO INICIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
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
              sessionStorage.setItem("access_token", accessToken);
            } else {
              sessionStorage.removeItem("access_token");
            }

            return {
              user,
              accessToken,
              isAuthenticated: !!user && !!accessToken,
            };
          },
          false,
          "auth/setUser",
        ),

      _reset: () =>
        set(
          () => {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("sucursal_activa_id");
            return initialState;
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
          const fullUser = adaptBackendUser(
            { ...backendUser, ...meResponse.data },
            session_id,
          );

          get()._setUser(fullUser, plainToken);
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
          get()._setUser(adaptBackendUser(backendUser, session_id), plainToken);
        } finally {
          get()._setLoading(false);
        }
      },

      /* ── Logout ── */

      logout: async () => {
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
        }
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
        /**
         * Si no hay token, no tiene sentido consultar /auth/me.
         * Esto evita bucles de llamadas cuando el usuario no está autenticado.
         */
        const token =
          get().accessToken ?? sessionStorage.getItem("access_token");
        if (!token) {
          get()._reset();
          return;
        }

        get()._setLoading(true);
        try {
          const meResponse = await authService.me();
          const backendUser = meResponse.data;

          /**
           * Recuperamos el token del sessionStorage (puente temporal).
           * En una implementación con httpOnly cookies, este paso
           * no sería necesario porque la cookie se envía automáticamente.
           */
          const storedToken = token;

          if (storedToken) {
            const fullUser = adaptBackendUser(backendUser, null);
            get()._setUser(fullUser, storedToken);
          } else {
            get()._reset();
          }
        } catch {
          // 401 → sesión inválida → limpiamos
          sessionStorage.removeItem("access_token");
          get()._reset();
        } finally {
          get()._setLoading(false);
        }
      },

      /* ── Sucursal Activa ── */

      setSucursalActiva: (sucursal) => {
        const { user, accessToken } = get();
        if (!user) return;

        const updatedUser: AuthUser = {
          ...user,
          sucursalActiva: sucursal,
        };

        /**
         * Actualizamos también sessionStorage para el interceptor.
         * En el interceptor de Axios leemos 'sucursal_activa_id'
         * para el header X-Sucursal-ID.
         */
        sessionStorage.setItem("sucursal_activa_id", String(sucursal.id));
        get()._setUser(updatedUser, accessToken);
      },

      /* ── Helpers de permisos ── */

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;

        const isSuper = user.roles.some((r) => r.name === "super-admin");
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
