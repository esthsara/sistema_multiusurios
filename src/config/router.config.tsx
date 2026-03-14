// src/config/router.config.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { PermissionGuard } from "@/shared/components/guards/PermissionGuard";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/* ── Layouts ── */
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));

/* ── Páginas públicas ── */
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage"));

/* ── Páginas privadas ── */
const HomePage = lazy(() => import("@/features/dashboard/components/HomePage"));
const PersonasPage = lazy(
  () => import("@/features/personas/components/PersonasPage"),
);
const SucursalesPage = lazy(
  () => import("@/features/sucursales/components/SucursalesPage"),
);
const UsuariosPage = lazy(
  () => import("@/features/usuarios/components/UsuariosPage"),
);
const RolesPage = lazy(
  () => import("@/features/roles-permisos/components/RolesPage"),
);
const AuditoriaPage = lazy(
  () => import("@/features/auditoria/components/AuditoriaPage"),
);
const NotFoundPage = lazy(() => import("@/shared/components/NotFoundPage"));

/**
 * PageLoader — Fallback mientras carga el chunk.
 * Reutilizable para todos los Suspense boundaries.
 */
const PageLoader = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: "var(--color-bg-base)" }}
  >
    <div
      className="animate-spin rounded-full h-10 w-10
                    border-2 border-[var(--color-primary-600)]
                    border-t-transparent"
    />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  /* ── Redirect raíz ── */
  {
    path: APP_ROUTES.ROOT,
    element: <Navigate to={APP_ROUTES.DASHBOARD.HOME} replace />,
  },

  /* ── Rutas Públicas ── */
  {
    element: withSuspense(AuthLayout),
    children: [{ path: APP_ROUTES.LOGIN, element: withSuspense(LoginPage) }],
  },

  /* ── Rutas Privadas — requieren autenticación ── */
  {
    element: <AuthGuard />,
    children: [
      {
        element: withSuspense(DashboardLayout),
        children: [
          {
            path: APP_ROUTES.DASHBOARD.ROOT,
            element: <Navigate to={APP_ROUTES.DASHBOARD.HOME} replace />,
          },
          {
            path: APP_ROUTES.DASHBOARD.HOME,
            element: withSuspense(HomePage),
          },

          /* Personas — requiere permiso */
          {
            element: <PermissionGuard permission="personas.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.PERSONAS.ROOT,
                element: withSuspense(PersonasPage),
              },
            ],
          },

          /* Sucursales */
          {
            element: <PermissionGuard permission="sucursales.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.SUCURSALES.ROOT,
                element: withSuspense(SucursalesPage),
              },
            ],
          },

          /* Usuarios */
          {
            element: <PermissionGuard permission="usuarios.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.USUARIOS.ROOT,
                element: withSuspense(UsuariosPage),
              },
            ],
          },

          /* Roles — solo admin */
          {
            element: <PermissionGuard permission="roles.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.ROLES,
                element: withSuspense(RolesPage),
              },
            ],
          },

          /* Auditoría — solo admin */
          {
            element: <PermissionGuard permission="auditoria.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.AUDITORIA,
                element: withSuspense(AuditoriaPage),
              },
            ],
          },
        ],
      },
    ],
  },

  /* ── 404 ── */
  {
    path: "*",
    element: withSuspense(NotFoundPage),
  },
]);
