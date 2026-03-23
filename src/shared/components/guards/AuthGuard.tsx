// src/shared/components/guards/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * AuthGuard — Protege rutas que requieren autenticación.
 * useLocation: captura la ruta actual para redirigir al login y luego volver a la ruta original.
 */
export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8
                        border-2 border-[var(--color-primary-600)]
                        border-t-transparent"
        />
      </div>
      /*Cambiar spiner aqui*/
    );
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
