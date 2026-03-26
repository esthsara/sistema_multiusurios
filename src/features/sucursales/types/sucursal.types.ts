import type { RequestParams } from "@/shared/types/api.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BACKEND TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface SucursalListItem {
  id: number;
  nombre: string;
  codigo: string;
  activa: boolean;
  email: string;
  direccion: string;
  descripcion?: string | null;
  horario: string;
  horario_apertura?: string;
  horario_cierre?: string;
  logo: string | null;
  es_administrador?: number;
  asignacion_activa?: number;
  es_actual?: boolean;
  usuarios_count?: number;
  created_at?: string;
  updated_at?: string;
  created_at_humano?: string;
}

export interface SucursalDetalle {
  id: number;
  nombre: string;
  codigo: string;
  activa: boolean;
  email: string;
  descripcion: string | null;
  horario_apertura: string;
  horario_cierre: string;
  horario_completo: string;
  direccion: string;
  logo: string | null;
  logo_path: string | null;
  usuarios_count: number;
  usuarios: SucursalUsuario[];
  administradores: SucursalAdministrador[];
  contactos: unknown[];
  domicilios: unknown[];
  archivos: unknown[];
  created_at: string;
  updated_at: string;
}

export interface SucursalUsuario {
  id: number;
  username: string;
  email: string;
  activo: boolean;
  ultimo_acceso: string;
  created_at: string;
  created_at_humano: string;
}

export interface SucursalAdministrador {
  id: number;
  persona_id: number;
  email: string;
  username: string;
  activo: boolean;
  pivot: {
    sucursal_id: number;
    usuario_id: number;
    es_administrador: number;
    activo: number;
  };
}

export interface SucursalSelector {
  id: number;
  nombre: string;
  codigo: string;
}

export interface VerificarCodigoResponse {
  codigo: string;
  disponible: boolean;
  mensaje: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   USUARIO EN SUCURSAL (asignaciones)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface SucursalUsuarioAsignacion {
  id: number;
  username: string;
  email: string;
  nombre: string | null;
  es_administrador: number;
  asignacion_activa: number;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface CreateSucursalDto {
  nombre: string;
  codigo: string;
  email: string;
  descripcion?: string;
  horario_apertura: string;
  horario_cierre: string;
  direccion: string;
  activa: boolean;
  logo?: File;
}

export interface UpdateSucursalDto {
  codigo?: string;
  nombre?: string;
  horario?: string;
  logo?: File;
  email?: string;
  descripcion?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  direccion?: string;
  activa?: boolean;
}

export interface ToggleSucursalStatusDto {
  activa: boolean;
  motivo?: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ASIGNACIONES DTOs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface AsignarUsuarioDto {
  usuario_id: number;
  sucursal_id: number;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface SucursalFilters {
  activa?: boolean | "";
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface SucursalQueryParams extends RequestParams {
  activa?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
