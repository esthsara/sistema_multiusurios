// src/config/axios.config.ts
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { toast } from "react-toastify";
import { handleHttpError } from "@/shared/utils/error.handler";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { tokenManager } from "@/shared/utils/tokenManager";
import { storageManager } from "@/shared/utils/storageManager";
import { useAuthStore } from "@/features/auth/store/auth.store";

/**
 * Creamos una instancia nombrada en lugar de usar axios directamente.
 * Esto es el principio Open/Closed de SOLID.
 */
/*Todas las peticiones al backend pasan por aquí*/
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    /*Le digo al backend desde qué sucursal estoy trabajando */
    "X-Sucursal-ID": "",
  },
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INTERCEPTOR DE REQUEST — Sale hacia el backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /**
     * Token JWT — Lo leeremos del store de Zustand en Paso 7.
     * Por ahora lo leemos de sessionStorage como puente temporal.
     *
     * NOTA TÉCNICA:
     * En Paso 6 usaremos httpOnly cookies para el refresh token.
     * El accessToken vivirá en memoria (Zustand), NO en localStorage.
     * sessionStorage es solo temporal para este paso.
     */
    const token = tokenManager.getToken();
    if (token && tokenManager.isSessionExpired()) {
      void handleUnauthorized("Tu sesión ha expirado por inactividad.");
      const error = new axios.CanceledError("SESSION_EXPIRED");
      return Promise.reject(error);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /**
     * Sucursal activa — Enviada en cada request para el backend.
     * En Paso 7 esto vendrá del store global de Zustand.
     */
    const sucursalId = storageManager.getSucursalId();
    if (sucursalId) {
      config.headers["X-Sucursal-ID"] = sucursalId;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INTERCEPTOR DE RESPONSE — Llega desde el backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * Flag para evitar múltiples redirects a login
 * si hay varias peticiones simultáneas que fallan con 401.
 */
let isRedirectingToLogin = false;
let redirectResetTimer: ReturnType<typeof setTimeout> | null = null;
let unauthorizedPromise: Promise<void> | null = null;
let hasNotifiedSessionExpired = false;

const hardResetSession = () => {
  tokenManager.removeToken();
  storageManager.removeSucursalId();
  storageManager.removeCachedUser();
};

const handleUnauthorized = async (
  message = "Tu sesión ha expirado. Inicia sesión nuevamente.",
) => {
  if (unauthorizedPromise) {
    return unauthorizedPromise;
  }

  unauthorizedPromise = (async () => {
    if (isRedirectingToLogin) {
      return;
    }

    isRedirectingToLogin = true;

    if (!hasNotifiedSessionExpired) {
      toast.warning(message);
      hasNotifiedSessionExpired = true;
    }

    try {
      const authStore = useAuthStore.getState();
      await authStore.logout();
    } catch {
      hardResetSession();
    }

    if (window.location.pathname !== APP_ROUTES.LOGIN) {
      // Pequeña espera para evitar redirección totalmente silenciosa.
      window.setTimeout(() => {
        window.location.replace(APP_ROUTES.LOGIN);
      }, 250);
    }

    if (redirectResetTimer) {
      clearTimeout(redirectResetTimer);
    }

    redirectResetTimer = setTimeout(() => {
      isRedirectingToLogin = false;
      hasNotifiedSessionExpired = false;
      unauthorizedPromise = null;
      redirectResetTimer = null;
    }, 3000);
  })();

  return unauthorizedPromise;
};

apiClient.interceptors.response.use(
  /**
   * Respuesta exitosa (2xx) — la dejamos pasar sin modificar.
   * Los servicios recibirán el AxiosResponse completo
   * y extraerán response.data
   */
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    /* 401 — Sesión expirada */
    if (status === 401) {
      /**
       * En login con credenciales incorrectas NO redirigimos,
       * dejamos que el módulo de auth muestre el toast local.
       */
      if (isLoginRequest) {
        return Promise.reject(error);
      }

      /**
       * Aquí centralizamos el logout implícito cuando el token
       * ya no es válido. Esto deja el flujo listo para migrar a
       * refresh token o cookies httpOnly más adelante.
       */
      await handleUnauthorized();
      return Promise.reject(error);
    }

    /* 403 — Sin permisos — muestra toast pero no redirige */
    if (status === 403) {
      handleHttpError(error);
      return Promise.reject(error);
    }

    /* 500, 502, 503 — Errores de servidor */
    if (status && status >= 500) {
      handleHttpError(error);
      return Promise.reject(error);
    }

    /**
     * Otros errores (400, 404, 422) — los propagamos sin toast.
     * El componente o servicio decide cómo mostrarlos
     * (útil para validaciones de formulario).
     */
    return Promise.reject(error);
  },
);

export default apiClient;
