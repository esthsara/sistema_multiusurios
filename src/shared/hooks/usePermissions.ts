// src/shared/hooks/usePermissions.ts
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { PermissionString, RoleName } from "@/shared/types/auth.types";

/**
 * PermissionsApi — La interfaz pública del hook.
 *
 * ¿Por qué definir la interfaz explícitamente?
 * Documenta exactamente qué ofrece el hook.
 * Si alguien importa usePermissions, sabe exactamente
 * qué puede usar sin leer la implementación.
 */
interface PermissionsApi {
  /** Tiene UN permiso específico */
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
}

export const usePermissions = (): PermissionsApi => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasRole = useAuthStore((s) => s.hasRole);
  const user = useAuthStore((s) => s.user);

  const isSuperAdmin =
    user?.roles.some((r) => r.name === "super-admin") ?? false;

  return {
    can: (permission) => hasPermission(permission),
    canAll: (permissions) => permissions.every((p) => hasPermission(p)),
    canAny: (permissions) => hasAnyPermission(permissions),
    cannot: (permission) => !hasPermission(permission),
    hasRole,
    isSuperAdmin,
  };
};
