// src/layouts/AuthLayout.tsx
/*Es un placeholder donde se renderizan las rutas hijas.*/
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // Si ya está autenticado, no tiene sentido mostrar el layout de Auth (Login, Register)
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD.HOME} replace />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      <Outlet />
    </div>
  );
};
export default AuthLayout;

