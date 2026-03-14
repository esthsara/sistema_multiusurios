// src/shared/components/guards/PermissionGuard.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { PermissionString } from "@/shared/types/auth.types";

interface PermissionGuardProps {
  /**
   * permission?: opcional — si no se pasa, solo verifica autenticación.
   * Usando el tipo PermissionString garantizamos que solo
   * se pasen permisos válidos del sistema.
   */
  permission?: PermissionString;
  fallback?: string; // Ruta a redirigir si no tiene permiso
}

export const PermissionGuard = ({
  permission,
  fallback = APP_ROUTES.DASHBOARD.HOME,
}: PermissionGuardProps) => {
  const { hasPermission } = useAuth();

  if (permission && !hasPermission(permission)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};
