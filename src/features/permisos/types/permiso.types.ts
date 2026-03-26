import type { PermissionString } from "@/shared/types/auth.types";

export interface PermisoItem {
  id: number;
  name: PermissionString | string;
  guard_name: string;
  modulo: string;
  accion: string;
  created_at: string;
}

/**
 * PermisosPorModulo — Estructura agrupada que devuelve /permisos/agrupados
 * Cada key es el nombre del módulo y el valor es un array de permisos
 */
export type PermisosPorModulo = Record<string, PermisoItemGrupado[]>;

export interface PermisoItemGrupado {
  id: number;
  name: PermissionString | string;
  accion: string;
}

export interface PermisoListItem extends PermisoItem {}

/* ── DTOs ── */

export interface CreatePermisoDto {
  name: string;
  guard_name?: string;
}

export interface UpdatePermisoDto {
  name?: string;
  guard_name?: string;
}

/* ── Filtros ── */

export interface PermisoFilters {
  modulo?: string;
  accion?: string;
  search?: string;
}
