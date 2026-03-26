// src/features/usuarios/types/usuario.types.ts
import type {
  TipoPersona,
  EstadoPersona,
  PermissionString,
} from "@/shared/types/auth.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BACKEND TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UsuarioSucursalBackend {
  id: number;
  nombre: string;
  codigo: string;
  activa: boolean;
  email: string;
  direccion: string;
  horario: string;
  logo: string | null;
  created_at: string;
  created_at_humano: string;
}

export interface RolDetalle {
  id: number;
  name: string;
  guard_name: string;
}

export interface SesionActiva {
  id: number;
  dispositivo: string;
  ip: string;
  ultima_actividad: string;
  login_at: string;
  es_actual: boolean;
  activa: boolean;
  currentToken?: {
    id: number;
    tokenable_type: string;
    tokenable_id: number;
    name: string;
    abilities: string[];
    last_used_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    tokenable?: {
      id: number;
      persona_id: number;
      email: string;
      username: string;
      current_branch_id: number | null;
      activo: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  } | null;
  "$this->token_id"?: number | null;
  "$currentToken->id,"?: number | null;
  [key: string]: unknown;
}

export interface UsuarioListItem {
  id: number;
  username: string;
  email: string;
  activo: boolean;
  estado?: EstadoPersona;
  persona: {
    id: number;
    tipo_persona: TipoPersona;
    tipo_texto: string;
    identificacion_principal: string;
    fecha_nacimiento: string | null;
    genero: string | null;
    foto: string | null;
    foto_path: string | null;
    estado: EstadoPersona;
    estado_texto: string;
    created_at?: string;
    updated_at?: string;
    contactos?: unknown[];
    domicilios?: unknown[];
    archivos?: unknown[];
    nombre?: string | null;
    apellido?: string | null;
    nombre_completo?: string | null;
    razon_social?: string | null;
  };
  sucursales_count?: number;
  ultimo_acceso?: string | null;
  roles: string[];
  roles_detalle: RolDetalle[];
  sucursales: UsuarioSucursalBackend[];
  created_at: string;
  updated_at: string;
  created_at_humano?: string;
}

export interface UsuarioDetalle extends UsuarioListItem {
  permisos: PermissionString[];
  sesiones_activas: SesionActiva[];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface CreateUsuarioDto {
  persona_id: number;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  activo: boolean;
}

export interface UpdateUsuarioDto {
  persona_id?: number;
  email?: string;
  username?: string;
  password?: string;
  password_confirmation?: string;
  activo?: boolean;
}

export interface ToggleStatusDto {
  activo: boolean;
  motivo?: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UsuarioFilters {
  estado?: EstadoPersona | "";
  activo?: boolean | "";
  sucursal_id?: number | "";
  rol?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

/**
 * UsuarioQueryParams — extiende filtros con params de paginación.
 *
 * ¿Por qué no usar any en el index signature?
 * Usamos un union type explícito para mantener seguridad de tipos
 * mientras permitimos campos dinámicos del backend.
 */
export interface UsuarioQueryParams extends UsuarioFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}
