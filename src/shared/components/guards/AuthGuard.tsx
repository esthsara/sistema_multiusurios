// src/shared/components/guards/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useUIStore } from "@/shared/store/ui.store";

/**
 * AuthGuard — Protege rutas que requieren autenticación.
 *
 * Validaciones en orden:
 * 1. Si está cargando → mostrar GlobalLoader (sin redirigir prematuramente)
 * 2. Si no está autenticado → redirigir a /login (guardando la ruta original)
 * 3. Si está autenticado pero sin sucursales → redirigir a /sin-sucursal
 * 4. Si todo está bien → renderizar la ruta hija
 */
export const AuthGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const { setGlobalLoading } = useUIStore.getState();
    if (isLoading) {
      setGlobalLoading(true, "Verificando accesos...");
    } else {
      setGlobalLoading(false);
    }
    return () => {
      setGlobalLoading(false);
    };
  }, [isLoading]);

  // Esperando inicialización — el GlobalLoader cubre la pantalla
  if (isLoading) return null;

  // Sin autenticación → login (preservando la ruta intentada para redirigir luego)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Autenticado pero sin sucursal asignada → página informativa
  // Evita que el usuario navegue la app con X-Sucursal-ID vacío
  if (user && user.sucursales.length === 0) {
    return <Navigate to={APP_ROUTES.NO_BRANCH} replace />;
  }

  return <Outlet />;
};
