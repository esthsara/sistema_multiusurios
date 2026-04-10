// src/shared/utils/error.handler.ts
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ApiError } from "@/shared/types/api.types";
import { safeText } from "@/shared/utils/sanitize";

/**
 * ERROR_MESSAGES — Mensajes centralizados por código HTTP.
 * Cambias el mensaje en un lugar y se actualiza en toda la app.
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: "Solicitud incorrecta. Verifica los datos enviados.",
  401: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
  403: "No tienes permisos para realizar esta acción.",
  404: "El recurso solicitado no fue encontrado.",
  408: "La solicitud tardó demasiado. Intenta de nuevo.",
  422: "Los datos enviados no son válidos.",
  429: "Demasiadas solicitudes. Espera un momento.",
  500: "Error interno del servidor. Contacta al administrador.",
  502: "El servidor no está disponible. Intenta más tarde.",
  503: "Servicio en mantenimiento. Intenta más tarde.",
};

/**
 * Aqui me mostraran el error que me devuelve el backend, lo parseo y lo normalizo a un formato común (ApiError)
 *
 * AxiosError<ApiError>: Generic que le dice a TypeScript
 * cómo luce el body del error que devuelve nuestro backend.
 */
export const parseApiError = (error: unknown): ApiError => {
  // Error de Axios con respuesta del servidor
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      return {
        message: safeText(
          axiosError.response.data?.message ??
            ERROR_MESSAGES[axiosError.response.status] ??
            "Error desconocido",
          "Error desconocido",
          300,
        ),
        errors: axiosError.response.data?.errors,
        status: axiosError.response.status,
      };
    }

    // Sin respuesta — problema de red o timeout
    if (axiosError.request) {
      return {
        message: "No se pudo conectar al servidor. Verifica tu conexión.",
        status: 0,
      };
    }
  }

  // Error no esperado
  return {
    message: "Ocurrió un error inesperado.",
    status: -1,
  };
};

/**
 * handleHttpError — Muestra notificación y retorna el error normalizado.
 * Se usa en el interceptor de respuesta para errores globales.
 *
 * silent: true → parsea el error sin mostrar toast
 * (útil cuando el componente quiere manejar el error localmente)
 */
export const handleHttpError = (error: unknown, silent = false): ApiError => {
  const parsed = parseApiError(error);

  if (!silent) {
    // Errores de validación (422) — muestra el primer campo con error
    if (parsed.status === 422 && parsed.errors) {
      const firstError = Object.values(parsed.errors)[0]?.[0];
      toast.error(safeText(firstError ?? parsed.message, parsed.message, 300));
    } else {
      toast.error(
        safeText(parsed.message, "Ocurrió un error inesperado.", 300),
      );
    }
  }

  return parsed;
};
/*Revisar si tiene el erro SARA */
