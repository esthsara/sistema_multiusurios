// src/shared/components/guards/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useUIStore } from "@/shared/store/ui.store";

/**
 * AuthGuard — Protege rutas que requieren autenticación.
 * useLocation: captura la ruta actual para redirigir al login y luego volver a la ruta original.
 */
export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Sincronizamos el estado local de auth con el GlobalLoader
    const { setGlobalLoading } = useUIStore.getState();
    if (isLoading) {
      setGlobalLoading(true, "Verificando accesos...");
    } else {
      setGlobalLoading(false);
    }
    
    // Limpiamos en caso de desmontaje
    return () => {
      setGlobalLoading(false);
    };
  }, [isLoading]);

  if (isLoading) {
    // Retornamos null para no flashear rutas hijas incorrectamente,
    // el GlobalLoader montado en AppProviders cubrirá toda la pantalla.
    return null;
  }

  if (!isAuthenticated) {
    /**
     * 'state' preserva la ruta intentada.
     * En el Login haremos: navigate(location.state?.from || '/dashboard')
     */
    return (
      <Navigate
        to={APP_ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
};
