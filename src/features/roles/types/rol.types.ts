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
