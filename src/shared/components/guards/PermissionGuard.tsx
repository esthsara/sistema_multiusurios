// src/shared/components/guards/PermissionGuard.tsx
import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { PermissionString } from "@/shared/types/auth.types";

interface PermissionGuardProps {
  /**
   * Un permiso único ─── o ─── un array de permisos con su operador.
   *
   * Un permiso:
   *   <PermissionGuard permission="personas.ver" />
   *
   * Varios con OR (al menos uno):
   *   <PermissionGuard permissions={["personas.ver", "personas.editar"]} operator="OR" />
   *
   * Varios con AND (todos requeridos):
   *   <PermissionGuard permissions={["roles.ver", "roles.editar"]} operator="AND" />
   */
  permission?: PermissionString;
  permissions?: PermissionString[];
  operator?: "OR" | "AND";
}

export const PermissionGuard = ({
  permission,
  permissions,
  operator = "OR",
}: PermissionGuardProps) => {
  const { canAll, canAny } = usePermissions();

  // Normalizar: siempre trabajamos con un array
  const required: PermissionString[] = permission
    ? [permission]
    : (permissions ?? []);

  // Sin restricciones definidas → solo verifica autenticación (AuthGuard se encarga)
  if (required.length === 0) return <Outlet />;

  const granted =
    operator === "AND"
      ? canAll(required)
      : canAny(required);

  if (!granted) {
    return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};
