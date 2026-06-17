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

export interface ConfirmState {
  open: boolean;
  type: "toggle" | "delete" | null;
  item: SucursalListItem | null;
  loading: boolean;
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
  contactos: SucursalContacto[];
  domicilios: SucursalDomicilio[];
  archivos: SucursalArchivo[];
  created_at: string;
  updated_at: string;
}

export type TipoContactoSucursal = "EMAIL" | "TELEFONO" | "OTRO";
export type TipoDomicilioSucursal =
  | "FISCAL"
  | "PARTICULAR"
  | "ENTREGA"
  | "OTRO";

export type TipoArchivoSucursal = "CI" | "CONTRATO" | "CERTIFICADO" | "FOTO" | "OTRO";

export interface SucursalContacto {
  id: number;
  tipo: TipoContactoSucursal;
  tipo_texto: string;
  valor: string;
  created_at: string;
  updated_at: string;
}

export interface SucursalDomicilio {
  id: number;
  tipo: TipoDomicilioSucursal;
  tipo_texto: string;
  pais: string;
  ciudad: string;
  direccion: string;
  codigo_postal: string | null;
  principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface SucursalArchivo {
  id: number;
  nombre: string | null;
  nombre_original: string | null;
  ruta: string;
  url: string;
  tipo: TipoArchivoSucursal;
  tipo_texto: string;
  fecha_expiracion: string | null;
  mime_type?: string | null;
  extension?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SucursalPersona {
  id: number;
  tipo_persona: string;
  nombre: string | null;
  apellido: string | null;
  razon_social?: string | null;
  identificacion_principal: string;
  estado: string;
  foto: string | null;
  foto_path: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SucursalUsuario {
  id: number;
  username: string;
  email: string;
  activo: boolean;
  ultimo_acceso: string;
  persona?: SucursalPersona;
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
  current_branch_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  persona?: SucursalPersona;
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
   AsignarUsuarioDto se encuentra en:
   @/features/asignaciones/types/asignacion.types
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

export interface CreateSucursalContactoDto {
  tipo: TipoContactoSucursal;
  valor: string;
}

export interface UpdateSucursalContactoDto {
  tipo: TipoContactoSucursal;
  valor: string;
}

export interface CreateSucursalDomicilioDto {
  tipo: TipoDomicilioSucursal;
  direccion: string;
  ciudad: string;
  pais: string;
  codigo_postal?: string;
  principal?: boolean;
}

export type UpdateSucursalDomicilioDto = Partial<CreateSucursalDomicilioDto>;

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
