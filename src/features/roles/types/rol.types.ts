// src/features/roles/types/rol.types.ts
import type { PermissionString } from "@/shared/types/auth.types";

export interface RolPermission {
  id: number;
  name: PermissionString | string;
  guard_name: string;
  modulo?: string;
  accion?: string;
  created_at?: string;
}

export interface RolUsuarioItem {
  id: number;
  username: string;
  email: string;
  activo?: boolean;
  persona?: {
    nombre?: string | null;
    apellido?: string | null;
    razon_social?: string | null;
    nombre_completo?: string | null;
  };
}

export interface RolListItem {
  id: number;
  name: string;
  guard_name: string;
  users_count?: number;
  activo?: boolean;
  is_active?: boolean;
  estado?: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RolDetalle extends RolListItem {
  permissions: RolPermission[];
}

export interface CreateRolDto {
  name: string;
  guard_name?: string;
  permissions?: number[];
}

export interface UpdateRolDto {
  name?: string;
  guard_name?: string;
}

export interface SyncPermissionsDto {
  permissions: number[];
}

export interface CopyRolDto {
  sourceRoleId: number;
  newName: string;
}

export interface RolFilters {
  search?: string;
  estado?: "" | "activo" | "inactivo";
  fecha_desde?: string;
  fecha_hasta?: string;
}

/** ── Asignación de Roles a Usuarios ── */

/** Shape de un rol simple en la respuesta de usuarios */
export interface RolDetalleSimple {
  id: number;
  name: string;
  guard_name: string;
}

/** Respuesta del backend al asignar/quitar roles a usuario */
export interface UsuarioConRoles {
  id: number;
  username: string;
  email: string;
  activo: boolean;
  roles: string[];
  roles_detalle: RolDetalleSimple[];
  permisos: string[];
  created_at: string;
  updated_at: string;
}

/** DTO para asignar uno o varios roles a un usuario */
export interface AssignRoleDto {
  role_id: number[];
}

/** DTO para quitar uno o varios roles de un usuario */
export interface RemoveRoleDto {
  role_id: number[];
}
