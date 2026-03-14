// src/config/axios.config.ts
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { handleHttpError } from "@/shared/utils/error.handler";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * Creamos una instancia nombrada en lugar de usar axios directamente.
 *
 * ¿Por qué? Si mañana cambiamos de Axios a Fetch o a otro cliente,
 * solo cambiamos este archivo. Los servicios no se tocan.
 * Esto es el principio Open/Closed de SOLID.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    /**
     * X-Sucursal-ID → Header personalizado.
     * El backend necesita saber con qué sucursal opera la petición.
     * Se actualiza dinámicamente en el interceptor de request.
     */
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
     * ⚠️  NOTA TÉCNICA:
     * En Paso 6 usaremos httpOnly cookies para el refresh token.
     * El accessToken vivirá en memoria (Zustand), NO en localStorage.
     * sessionStorage es solo temporal para este paso.
     */
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /**
     * Sucursal activa — Enviada en cada request para el backend.
     * En Paso 7 esto vendrá del store global de Zustand.
     */
    const sucursalId = sessionStorage.getItem("sucursal_activa_id");
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

apiClient.interceptors.response.use(
  /**
   * Respuesta exitosa (2xx) — la dejamos pasar sin modificar.
   * Los servicios recibirán el AxiosResponse completo
   * y extraerán response.data
   */
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;

    /* 401 — Sesión expirada */
    if (status === 401) {
      /**
       * En Paso 6 aquí irá la lógica de Refresh Token.
       * Si el refresh falla → logout y redirect a login.
       * Por ahora solo hacemos el redirect.
       */
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("sucursal_activa_id");

        /**
         * Usamos window.location en lugar de useNavigate
         * porque los interceptores viven fuera del árbol de React.
         * No tienen acceso a hooks.
         */
        window.location.href = APP_ROUTES.LOGIN;
        setTimeout(() => {
          isRedirectingToLogin = false;
        }, 3000);
      }
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
