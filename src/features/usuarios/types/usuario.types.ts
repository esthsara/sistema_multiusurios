import type { TipoPersona, EstadoPersona } from "@/shared/types/auth.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESPUESTAS DEL BACKEND */

export interface UsuarioListItem {
  id: number;
  username: string;
  email: string;
  activo: boolean;
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
    nombre?: string | null;
    apellido?: string | null;
    nombre_completo?: string | null;
    razon_social?: string | null;
  };
  sucursales_count: number;
  ultimo_acceso: string | null;
  roles?: string[];
  roles_detalle?: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
  created_at: string;
  created_at_humano: string;
}

export interface UsuarioDetalle {
  id: number;
  username: string;
  email: string;
  activo: boolean;
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
    nombre?: string | null;
    apellido?: string | null;
    nombre_completo?: string | null;
    razon_social?: string | null;
    contactos: unknown[];
    domicilios: unknown[];
    archivos: unknown[];
  };
  sucursales: Array<{
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
  }>;
  roles: string[];
  roles_detalle: Array<{
    id: number;
    name: string;
    guard_name: string;
  }>;
  permisos: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUsuarioDto {
  persona_id: number;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  activo: boolean;
}

export type UpdateUsuarioDto = Partial<
  Omit<CreateUsuarioDto, "persona_id" | "password_confirmation">
>;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS DE TABLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface UsuarioFilters {
  estado?: boolean | "";
  sucursal_id?: number | "";
  rol?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
