// src/shared/services/http.service.ts
import apiClient from "@/config/axios.config";
import { handleHttpError } from "@/shared/utils/error.handler";
import type {
  ApiResponse,
  PaginatedResponse,
  RequestParams,
} from "@/shared/types/api.types";

/**
 * HttpService — Wrapper genérico sobre Axios.
 *
 * Todos los métodos son genéricos <T>.
 * El tipo T lo define cada servicio de feature al llamarlo.
 *
 * Ejemplo en personasService:
 *   http.get<Persona>('/personas/1')
 *   → TypeScript sabe que el resultado es ApiResponse<Persona>
 */
export const http = {
  /**
   * GET — Recurso único
   * Usado para: obtener detalle de una entidad
   */
  async get<T>(
    url: string,
    params?: RequestParams,
    options?: { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {};
      if (options?.silent) {
        headers["X-Silent-Error"] = "true";
      }
      const response = await apiClient.get<ApiResponse<T>>(url, { params, headers });
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
      /**
       * silent: true → no mostramos toast aquí.
       * El componente decide si mostrar el error o manejarlo silenciosamente.
       */
    }
  },

  /**
   * GET PAGINATED — Lista con paginación de Laravel
   * Usado para: tablas con paginación server-side
   */
  async getPaginated<T>(
    url: string,
    params?: RequestParams,
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await apiClient.get<PaginatedResponse<T>>(url, {
        params,
      });
      const payload = response.data as unknown;

     /* if (import.meta.env.DEV) {
        console.groupCollapsed(`[http.getPaginated] ${url}`);
        console.log("params:", params);
        console.log("raw response.data:", payload);
        console.groupEnd();
      }*/

      /**
       * Soporta ambas formas de backend:
       * 1) { data: [...], meta, links }
       * 2) { success, message, data: { data: [...], meta, links } }
       */
      if (
        payload &&
        typeof payload === "object" &&
        Array.isArray((payload as PaginatedResponse<T>).data)
      ) {
        return payload as PaginatedResponse<T>;
      }

      if (
        payload &&
        typeof payload === "object" &&
        "data" in (payload as Record<string, unknown>)
      ) {
        const wrapped = payload as ApiResponse<unknown>;

        // Caso estándar envuelto: { data: { data: [...], meta, links } }
        const wrappedAsPaginated = wrapped.data as PaginatedResponse<T>;
        if (wrappedAsPaginated && Array.isArray(wrappedAsPaginated.data)) {
          return wrappedAsPaginated;
        }

        // Caso actual backend: { data: { items: [...], pagination: {...} } }
        const wrappedData = wrapped.data as {
          items?: T[];
          pagination?: {
            total?: number;
            per_page?: number;
            current_page?: number;
            last_page?: number;
            from?: number;
            to?: number;
          };
        };

        if (wrappedData && Array.isArray(wrappedData.items)) {
          const normalized: PaginatedResponse<T> = {
            data: wrappedData.items,
            meta: {
              total: wrappedData.pagination?.total ?? wrappedData.items.length,
              per_page:
                wrappedData.pagination?.per_page ?? wrappedData.items.length,
              current_page: wrappedData.pagination?.current_page ?? 1,
              last_page: wrappedData.pagination?.last_page ?? 1,
              from: wrappedData.pagination?.from ?? 1,
              to: wrappedData.pagination?.to ?? wrappedData.items.length,
            },
            links: {
              first: null,
              last: null,
              prev: null,
              next: null,
            },
          };

          /*if (import.meta.env.DEV) {
            console.groupCollapsed(`[http.getPaginated] normalized ${url}`);
            console.log("normalized:", normalized);
            console.groupEnd();
          }*/

          return normalized;
        }
      }

      throw new Error("Invalid paginated response format");
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  /**
   * POST — Crear recurso
   * TBody: tipo del body que enviamos
   * TResponse: tipo de la respuesta que esperamos
   */
  async post<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
  ): Promise<ApiResponse<TResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<TResponse>>(url, body);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  /**
   * PUT — Reemplazar recurso completo
   */
  async put<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
  ): Promise<ApiResponse<TResponse>> {
    try {
      const response = await apiClient.put<ApiResponse<TResponse>>(url, body);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  /**
   * PATCH — Actualización parcial
   * Preferido para actualizaciones de estado (activo/inactivo)
   * y auditoría (solo cambia un campo)
   */
  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
  ): Promise<ApiResponse<TResponse>> {
    try {
      const response = await apiClient.patch<ApiResponse<TResponse>>(url, body);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  /**
   * DELETE — Eliminar recurso (soft delete en Laravel)
   * ApiResponse<void>: DELETE exitoso no devuelve data
   */
  async delete(url: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(url);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  /**
   * Para subir archivos (tabla 'archivo' polimórfica)
   * Cambia Content-Type a multipart/form-data automáticamente
   */
  async upload<TResponse>(
    url: string,
    formData: FormData,
  ): Promise<ApiResponse<TResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<TResponse>>(
        url,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },
};
