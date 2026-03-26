import type { PermissionString } from "@/shared/types/auth.types";

export interface PermisoItem {
  id: number;
  name: PermissionString;
  guard_name: string;
  modulo: string;
  accion: string;
  created_at: string;
}

/**
 * PermisosPorModulo — Estructura agrupada que devuelve /permisos/matriz
 * Cada key es el nombre del módulo y el valor es un array de permisos
 */
export type PermisosPorModulo = Record<string, PermisoItemMatriz[]>;

export interface PermisoItemMatriz {
  id: number;
  name: PermissionString;
  accion: string;
}

/* ── DTOs ── */

export interface CreatePermisoDto {
  name: string;
  guard_name: "api";
}

/* ── Filtros ── */

export interface PermisoFilters {
  modulo?: string;
  search?: string;
}
