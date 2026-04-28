// src/shared/types/auth.types.ts

export type TipoPersona = "FISICA" | "MORAL";
export type EstadoPersona = "ACTIVO" | "INACTIVO" | "BLOQUEADO";
export type RoleName = string;

/**
 *
 * listamos permisos conocidos para tener autocompletado y evitar errores de typo y tambien los permitimos como string dinamico para que el sistema sea flexible y no dependa de una lista fija en el frontend.
 */
type KnownPermission =
  // ── Personas ─────────────────────────────
  | "personas.ver"
  | "personas.crear"
  | "personas.editar"
  | "personas.eliminar"
  // ── Sucursales ────────────────────────────
  | "sucursales.ver"
  | "sucursales.crear"
  | "sucursales.editar"
  | "sucursales.eliminar"
  // ── Usuarios ─────────────────────────────
  | "usuarios.ver"
  | "usuarios.crear"
  | "usuarios.editar"
  | "usuarios.eliminar"
  // ── Roles ────────────────────────────────
  | "roles.ver"
  | "roles.crear"
  | "roles.editar"
  | "roles.eliminar"
  // ── Permisos (gestión interna) ────────────
  | "permisos.ver"
  | "permisos.crear"
  | "permisos.editar"
  | "permisos.eliminar"
  | "permisos.asignar"
  // ── Asignaciones usuario-sucursal ─────────
  | "asignaciones.ver"
  | "asignaciones.crear"
  | "asignaciones.eliminar"
  // ── Auditoría ─────────────────────────────
  | "auditoria.ver";

type DynamicPermission = string & {};
export type PermissionString = KnownPermission | DynamicPermission;

export interface BackendPersona {
  id: number;
  tipo_persona: TipoPersona;
  tipo_texto?: string | null;
  nombre: string | null;
  apellido: string | null;
  nombre_completo?: string | null;
  razon_social: string | null;
  identificacion_principal: string;
  fecha_nacimiento: string | null;
  genero: string | null;
  foto?: string | null;
  foto_path: string | null;
  estado: EstadoPersona;
  estado_texto?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BackendSucursal {
  id: number;
  nombre: string;
  clave?: string;
  codigo?: string;
  es_actual?: boolean;
}

export interface BackendRoleObject {
  id: number;
  name: RoleName;
  permissions?: PermissionString[];
  permisos?: PermissionString[];
}

export type BackendRole = BackendRoleObject | string;

export interface BackendBusiness {
  id: number;
  nombre: string;
  codigo: string;
  activa?: boolean;
  email?: string | null;
  descripcion?: string | null;
  horario_apertura?: string | null;
  horario_cierre?: string | null;
  horario_completo?: string | null;
  direccion?: string | null;
  logo?: string | null;
  logo_path?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BackendUser {
  id: number;
  persona_id?: number;
  email: string;
  username: string;
  current_branch_id?: number | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  current_branch?: BackendSucursal | null;
  persona: BackendPersona;
  sucursales?: BackendSucursal[];
  roles?: BackendRole[];
  /**
   * El backend devuelve 'permisos', no 'permissions'.
   */
  permisos?: PermissionString[];
  contexto?: {
    tipo: string;
    business_actual: BackendBusiness | BackendSucursal | number | null;
    business_ids?: number[];
  };
}

/**
 * AccessTokenObject — Estructura del token en /auth/login
 * El register devuelve string, el login devuelve este objeto.
 */
export interface AccessTokenObject {
  accessToken: {
    id: number;
    name: string;
    abilities: string[];
    expires_at: string | null;
    tokenable_id: number;
    tokenable_type: string;
    created_at: string;
    updated_at: string;
  };
  plainTextToken: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIPOS NORMALIZADOS — Lo que usa
   el frontend internamente (post-adapter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * Persona normalizada — campos calculados incluidos.
 * 'nombreCompleto' es derivado según tipo_persona.
 */

export interface Persona {
  id: number;
  tipoPersona: TipoPersona;
  tipoTexto?: string | null;
  nombre: string | null;
  apellido: string | null;
  razonSocial: string | null;
  identificacionPrincipal: string;
  fechaNacimiento: string | null;
  genero: string | null;
  fotoPatch: string | null;
  estado: EstadoPersona;
  estadoTexto?: string | null;
  nombreCompleto: string; // calculado en el adapter
}

export interface Sucursal {
  id: number;
  nombre: string;
  clave: string;
}

export interface Role {
  id: number;
  name: RoleName;
  permisos: PermissionString[];
}

/**
 * AuthUser — La entidad central normalizada.
 * Lo que usa TODO el frontend después del adapter.
 * Nunca usa BackendUser directamente fuera del adapter.
 */
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  activo: boolean;
  persona: Persona;
  roles: Role[];
  permisos: PermissionString[];
  sucursales: Sucursal[];
  sucursalActiva: Sucursal | null;
  sessionId: number | null;
  contexto?: {
    tipo: string;
    businessActual: Sucursal | number | null;
    businessIds: number[];
  };
}

/**
 * AuthState — Estado completo de autenticación en Zustand.
 */
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthInitialized: boolean;
  /**
   * Timestamp que se actualiza en cada switch de sucursal.
   * Úsalo como parte del queryKey o en useEffect para invalidar
   * automáticamente los datos de módulos al cambiar de sucursal.
   *
   * Ejemplo con React Query:
   *   queryKey: ["personas", branchSwitchedAt]
   *
   * Ejemplo con useEffect:
   *   useEffect(() => { fetchDatos(); }, [branchSwitchedAt]);
   */
  branchSwitchedAt: number | null;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs — Lo que enviamos al backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface LoginDto {
  /**
   * 'login' — acepta email o username según el backend.
   * No llamamos al campo 'email' porque el backend
   * explícitamente lo llama 'login'.
   */
  login: string;
  password: string;
}

export interface RegisterFisicaDto {
  tipo_persona: "FISICA";
  nombre: string;
  apellido: string;
  identificacion_principal: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

export interface RegisterMoralDto {
  tipo_persona: "MORAL";
  razon_social: string;
  identificacion_principal: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

export type RegisterDto = RegisterFisicaDto | RegisterMoralDto;

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
