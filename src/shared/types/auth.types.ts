// src/shared/types/auth.types.ts

/**
 * Permisos en formato "recurso.accion" — igual que Laravel-Permission.
 * Template Literal Type: garantiza el formato correcto en compilación.
 * ¿Por qué? Si escribes 'personas-ver' TypeScript te avisa del error.
 */
export type PermissionString =
  | "personas.ver"
  | "personas.crear"
  | "personas.editar"
  | "personas.eliminar"
  | "sucursales.ver"
  | "sucursales.crear"
  | "sucursales.editar"
  | "sucursales.eliminar"
  | "usuarios.ver"
  | "usuarios.crear"
  | "usuarios.editar"
  | "usuarios.eliminar"
  | "roles.ver"
  | "roles.crear"
  | "roles.editar"
  | "roles.eliminar"
  | "auditoria.ver";

/**
 * Roles del sistema — Union Type.
 * Beneficio: autocompletado en todo el proyecto.
 */
export type RoleName = "super-admin" | "admin" | "editor" | "viewer";

export interface Role {
  id: number;
  name: RoleName;
  permissions: PermissionString[];
}

export interface Persona {
  id: number;
  tipo: "fisica" | "moral";
  nombre: string;
  rfc?: string;
}

/**
 * AuthUser — La entidad central del sistema.
 * Extiende Persona con credenciales, roles y sucursales.
 *
 * ¿Por qué no un User simple?
 * Porque según el contexto, un Usuario ES una Persona con credenciales.
 * Esto refleja el modelo de dominio real.
 */
export interface AuthUser {
  id: number;
  email: string;
  persona: Persona;
  roles: Role[];
  permissions: PermissionString[]; // Permisos directos + heredados de roles
  sucursales: Sucursal[];
  sucursalActiva: Sucursal;
}

export interface Sucursal {
  id: number;
  nombre: string;
  clave: string;
}

/**
 * AuthState — El estado completo de autenticación.
 * Genérico implícito: null significa "no autenticado".
 */
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
