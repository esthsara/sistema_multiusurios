import type { RequestParams } from "@/shared/types/api.types";

export interface AsignacionUsuarioSucursal {
  id: number;
  usuario_id: number;
  sucursal_id: number;
  rol_id?: number | null;
  usuario?: {
    id: number;
    username: string;
    email: string;
    nombre?: string;
    activo?: boolean;
  };
  sucursal?: {
    id: number;
    nombre: string;
    codigo: string;
  };
  rol?: {
    id: number;
    name: string;
    guard_name?: string;
  };
  activo: boolean | null;
  created_at: string;
  created_at_humano?: string;
  updated_at?: string;
}

export interface AsignarUsuarioDto {
  usuario_id: number;
  sucursal_id: number;
}

export interface AsignacionFilters {
  sucursal_id?: number;
  usuario_id?: number;
  search?: string;
}

export interface AsignacionQueryParams extends RequestParams {
  sucursal_id?: number;
  usuario_id?: number;
  rol_id?: number;
  activa?: boolean;
  search?: string;
}
