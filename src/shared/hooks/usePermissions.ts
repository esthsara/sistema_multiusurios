// src/shared/hooks/usePermissions.ts
import { useAuthStore } from "@/features/auth/store/auth.store";
import { isSuperAdminRole } from "@/shared/utils/role.utils";
import type { PermissionString, RoleName } from "@/shared/types/auth.types";

/**
 * PermissionsApi — La interfaz pública del hook.
 *
 * Métodos genéricos: can, canAll, canAny, cannot, hasRole, isSuperAdmin
 * Helpers semánticos: canView, canEdit, canDelete, canCreate
 *   → usan hasPermission internamente, que aplica la jerarquía automática
 *     (editar / eliminar implica ver).
 */
interface PermissionsApi {
  /** Tiene UN permiso específico (aplica jerarquía automática) */
  can: (permission: PermissionString) => boolean;
  /** Tiene TODOS los permisos del array (AND lógico) */
  canAll: (permissions: PermissionString[]) => boolean;
  /** Tiene AL MENOS UNO de los permisos (OR lógico) */
  canAny: (permissions: PermissionString[]) => boolean;
  /** NO tiene el permiso */
  cannot: (permission: PermissionString) => boolean;
  /** Tiene el rol */
  hasRole: (role: RoleName | RoleName[]) => boolean;
  /** Es super-admin */
  isSuperAdmin: boolean;

  // ── Helpers semánticos por módulo ──────────────────────────────────
  /** Puede ver el módulo (o tiene editar/eliminar → jerarquía automática) */
  canView: (module: string) => boolean;
  /** Puede editar el módulo */
  canEdit: (module: string) => boolean;
  /** Puede eliminar en el módulo */
  canDelete: (module: string) => boolean;
  /** Puede crear en el módulo */
  canCreate: (module: string) => boolean;
}

export const usePermissions = (): PermissionsApi => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasRole = useAuthStore((s) => s.hasRole);
  const user = useAuthStore((s) => s.user);

  const isSuperAdmin =
    user?.roles.some((r) => isSuperAdminRole(r.name)) ?? false;

  return {
    can: (permission) => hasPermission(permission),
    canAll: (permissions) => permissions.every((p) => hasPermission(p)),
    canAny: (permissions) => hasAnyPermission(permissions),
    cannot: (permission) => !hasPermission(permission),
    hasRole,
    isSuperAdmin,

    // Helpers semánticos — delegan en hasPermission (con jerarquía)
    canView: (module) => hasPermission(`${module}.ver` as PermissionString),
    canEdit: (module) => hasPermission(`${module}.editar` as PermissionString),
    canDelete: (module) =>
      hasPermission(`${module}.eliminar` as PermissionString),
    canCreate: (module) =>
      hasPermission(`${module}.crear` as PermissionString),
  };
};

