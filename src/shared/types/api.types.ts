// src/shared/types/api.types.ts

/**
 * ApiResponse<T> — Envuelve cualquier respuesta exitosa del backend.
 *
 * Generic <T>: el tipo del campo 'data' cambia según el endpoint.
 * Ejemplo:
 *   ApiResponse<Persona>    → data es una Persona
 *   ApiResponse<Persona[]>  → data es un array de Personas
 *   ApiResponse<void>       → sin data (ej: DELETE exitoso)
 */
export interface ApiResponse<T = void> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * PaginatedResponse<T> — Para endpoints con paginación de Laravel.
 * Refleja exactamente la estructura que devuelve
 * Laravel Resource con ->paginate()
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

/**
 * 
 * ApiError — Estructura de error estándar de Laravel.
 * Laravel devuelve errores de validación en 'errors'
 * como { campo: ['mensaje'] }
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

/**
 * RequestParams — Parámetros comunes de query string.
 * Reutilizable en cualquier servicio que liste recursos.
 */
export interface RequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
  /**
   * [key: string] — Index Signature.
   * Permite params adicionales específicos por módulo
   * sin perder el tipado de los campos conocidos.
   */
}

/**
 * HttpMethod — Union Type para los métodos HTTP.
 * Usado internamente en el servicio base.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
