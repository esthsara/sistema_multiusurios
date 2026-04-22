
// src/shared/components/guards/PermissionGuard.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { PermissionString } from "@/shared/types/auth.types";

interface PermissionGuardProps {
  /**
   * permission?: opcional — si no se pasa, solo verifica autenticación.
   * Aqui solo deja entrar a usurios como unguardia que deja eentrar a usuarios autenticados, pero si se pasa un permiso, verifica que el usuario tenga ese permiso específico.
   * Si el usuario no tiene el permiso requerido, se redirige a la ruta especificada en fallback.
   * Si no se pasa un permiso, simplemente verifica que el usuario esté autenticado.
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
