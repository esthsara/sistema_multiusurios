// src/features/asignaciones/types/asignacion.types.ts
import type { RequestParams } from "@/shared/types/api.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIPOS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface AsignacionUsuarioSucursal {
  id: number;
  usuario_id: number;
  sucursal_id: number;
  rol_id: number;
  usuario: {
    id: number;
    username: string;
    email: string;
    nombre?: string;
    activo: boolean;
  };
  sucursal: {
    id: number;
    nombre: string;
    codigo: string;
  };
  rol: {
    id: number;
    name: string;
  };
  es_administrador: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AsignacionListItem extends AsignacionUsuarioSucursal {}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface CreateAsignacionDto {
  usuario_id: number;
  sucursal_id: number;
  rol_id: number;
  es_administrador?: boolean;
}

export interface UpdateAsignacionDto {
  rol_id?: number;
  es_administrador?: boolean;
  activo?: boolean;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface AsignacionFilters {
  sucursal_id?: number;
  usuario_id?: number;
  rol_id?: number;
  activa?: boolean | "";
  search?: string;
}

export interface AsignacionQueryParams extends RequestParams {
  sucursal_id?: number;
  usuario_id?: number;
  rol_id?: number;
  activa?: boolean;
  search?: string;
}
