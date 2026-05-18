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
 * AxiosInstance es la interfaz que define los métodos HTTP (get, post, etc.)
 */
/*Todas las peticiones al backend pasan por aquí*/
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* INTERCEPTOR DE REQUEST — */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //const token = tokenManager.getToken();
    //accedo al zustand para el token
    const authStore = useAuthStore.getState();
    const token = authStore.accessToken ?? tokenManager.getToken();

    //si tenemos un token vencido, hacemos logout y redirigimos a login

    if (token && tokenManager.isSessionExpired()) {
      void handleUnauthorized("Tu sesión ha expirado por inactividad.");
      const error = new axios.CanceledError("SESSION_EXPIRED");
      return Promise.reject(error);
    }

    // Adjuntar token válido al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Sucursal activa — única fuente de verdad: Zustand → auth.user.sucursalActiva
    // Validación adicional: solo enviar si la sucursal activa pertenece al usuario.
    // Esto previene que una sucursal manipulada externamente llegue al backend.
    const sucursalActiva = authStore.user?.sucursalActiva;
    const sucursalesPermitidas = authStore.user?.sucursales.map((s) => s.id) ?? [];

    if (sucursalActiva && sucursalesPermitidas.includes(sucursalActiva.id)) {
      config.headers["X-Sucursal-ID"] = String(sucursalActiva.id);
    } else {
      delete config.headers["X-Sucursal-ID"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

//evitamos multiples redirecciones a login si varias peticiones fallan con 401 al mismo tiempo
let isRedirectingToLogin = false;
//resetea los flags que controlan la redirección a login
let redirectResetTimer: ReturnType<typeof setTimeout> | null = null;
//guarda la promesa de manejo de sesión expirada
let unauthorizedPromise: Promise<void> | null = null;
//evita mostrar múltiples toasts de sesión expirada
let hasNotifiedSessionExpired = false;
//para borrar
const hardResetSession = () => {
  tokenManager.removeToken();
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
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    // Las peticiones canceladas por SESSION_EXPIRED son silenciosas.
    // No mostrar error de red al usuario — el handleUnauthorized ya mostró el modal.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";
    const isAuthRequest = requestUrl.includes("/auth/");
    const isLoginRequest = requestUrl.includes("/auth/login");

    /* 401 — Sesión expirada */
    if (status === 401) {
      //En login con credenciales incorrectas NO redirigimos
      if (isLoginRequest) {
        return Promise.reject(error);
      }
      await handleUnauthorized();
      return Promise.reject(error);
    }

    const isSilentError = error.config?.headers?.["X-Silent-Error"] === "true" || error.config?.headers?.["x-silent-error"] === "true";

    /* 403 — Sin permisos  */
    if (status === 403) {
      if (isAuthRequest || isSilentError) {
        return Promise.reject(error);
      }
      handleHttpError(error);
      return Promise.reject(error);
    }

    /* 500, 502, 503 — Errores de servidor */
    if (status && status >= 500) {
      if (isAuthRequest) {
        return Promise.reject(error);
      }
      handleHttpError(error);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
