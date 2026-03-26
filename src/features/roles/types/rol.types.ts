// src/features/roles/types/rol.types.ts
import type { PermissionString } from "@/shared/types/auth.types";

export interface RolListItem {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface RolDetalle extends RolListItem {
  permisos?: PermissionString[];
}

export interface CreateRolDto {
  name: string;
  guard_name?: string;
}

export interface SyncPermissionsDto {
  permissions: number[];
}
