// src/config/router.config.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { PermissionGuard } from "@/shared/components/guards/PermissionGuard";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useUIStore } from "@/shared/store/ui.store";

/* ── Layouts ── */
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));

/* ── Páginas públicas ── */
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage"));
const NoBranchPage = lazy(
  () => import("@/features/auth/components/NoBranchPage"),
);

/* ── Páginas privadas ── */
const HomePage = lazy(() => import("@/features/dashboard/components/HomePage"));
const ProfilePage = lazy(
  () => import("@/features/auth/components/ProfilePage"),
);
const PersonasPage = lazy(
  () => import("@/features/personas/components/PersonasPage"),
);
const PersonaDetallePage = lazy(
  () => import("@/features/personas/components/detalle/PersonaDetallePage"),
);
const SucursalesPage = lazy(
  () => import("@/features/sucursales/components/SucursalesPage"),
);
const SucursalDetallePage = lazy(
  () => import("@/features/sucursales/components/detalle/SucursalDetallePage"),
);
const UsuariosPage = lazy(
  () => import("@/features/usuarios/components/UsuariosPage"),
);
const UsuarioDetallePage = lazy(
  () => import("@/features/usuarios/components/detalle/UsuarioDetallePage"),
);
const RolesPage = lazy(() => import("@/features/roles/components/RolesPage"));

const MatrizPage = lazy(
  () => import("@/features/matriz/components/MatrizPage"),
);
const AsignacionesPage = lazy(
  () => import("@/features/asignaciones/components/AsignacionesPage"),
);
const AuditoriaPage = lazy(
  () => import("@/features/auditoria/components/AuditoriaPage"),
);
const SessionsPage = lazy(
  () => import("@/features/sessions/components/SessionPage"),
);
const NotFoundPage = lazy(() => import("@/shared/components/NotFoundPage"));
const UnauthorizedPage = lazy(
  () => import("@/shared/components/UnauthorizedPage"),
);

/**
 * PageLoader — Se muestra mientras se cargan las páginas perezosas.
 * Activa el loader global del store para mostrar feedback visual.
 */
const PageLoader = () => {
  useEffect(() => {
    const { setGlobalLoading } = useUIStore.getState();
    setGlobalLoading(true, "Cargando vista...");
    return () => setGlobalLoading(false);
  }, []);
  return null;
};

/** Envuelve un componente en Suspense con el loader global. */
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/*
 * ── Cómo añadir una ruta protegida ────────────────────────────────────────
 *
 * 1. Registrar la ruta en routes.constants.ts
 * 2. Crear la página con lazy()
 * 3. Añadir el bloque usando <PermissionGuard permission="modulo.ver" />
 *
 * Un permiso:
 *   { element: <PermissionGuard permission="productos.ver" />,
 *     children: [{ path: ..., element: withSuspense(ProductosPage) }] }
 *
 * Varios permisos (OR — al menos uno):
 *   { element: <PermissionGuard permissions={["productos.ver","productos.editar"]} operator="OR" />,
 *     children: [...] }
 */
export const router = createBrowserRouter([
  /* ── Redirect raíz ── */
  {
    path: APP_ROUTES.ROOT,
    element: <Navigate to={APP_ROUTES.DASHBOARD.HOME} replace />,
  },

  /* ── Rutas públicas ── */
  {
    element: withSuspense(AuthLayout),
    children: [{ path: APP_ROUTES.LOGIN, element: withSuspense(LoginPage) }],
  },

  /* Ruta semi-pública: usuario autenticado pero sin sucursal asignada.
   * Fuera del AuthGuard para evitar bucle de redirección. */
  {
    path: APP_ROUTES.NO_BRANCH,
    element: withSuspense(NoBranchPage),
  },

  /* ── Página 403 ─── fuera del layout pero accesible tras login ── */
  {
    path: APP_ROUTES.UNAUTHORIZED,
    element: withSuspense(UnauthorizedPage),
  },

  /* ── Rutas privadas — requieren autenticación ── */
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

          /* Dashboard y Perfil — sin permiso específico (solo login) */
          {
            path: APP_ROUTES.DASHBOARD.HOME,
            element: withSuspense(HomePage),
          },
          {
            path: APP_ROUTES.DASHBOARD.PROFILE,
            element: withSuspense(ProfilePage),
          },

          /* ── Personas ── */
          {
            element: <PermissionGuard permission="personas.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.PERSONAS.ROOT,
                element: withSuspense(PersonasPage),
              },
              {
                path: `${APP_ROUTES.DASHBOARD.PERSONAS.ROOT}/:id`,
                element: withSuspense(PersonaDetallePage),
              },
            ],
          },

          /* ── Sucursales ── */
          {
            element: <PermissionGuard permission="sucursales.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.SUCURSALES.ROOT,
                element: withSuspense(SucursalesPage),
              },
              {
                path: `${APP_ROUTES.DASHBOARD.SUCURSALES.ROOT}/:id`,
                element: withSuspense(SucursalDetallePage),
              },
            ],
          },

          /* ── Usuarios ── */
          {
            element: <PermissionGuard permission="usuarios.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.USUARIOS.ROOT,
                element: withSuspense(UsuariosPage),
              },
              {
                path: `${APP_ROUTES.DASHBOARD.USUARIOS.ROOT}/:id`,
                element: withSuspense(UsuarioDetallePage),
              },
            ],
          },

          /* ── Roles ── */
          {
            element: <PermissionGuard permission="roles.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.ROLES,
                element: withSuspense(RolesPage),
              },
            ],
          },

          /* ── Matriz Roles-Permisos ── requiere poder asignar ── */
          {
            element: <PermissionGuard permission="permisos.asignar" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.MATRIZ,
                element: withSuspense(MatrizPage),
              },
            ],
          },

          /* ── Asignaciones Usuario-Sucursal ── permiso propio ── */
          {
            element: <PermissionGuard permission="asignaciones.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.ASIGNACIONES,
                element: withSuspense(AsignacionesPage),
              },
            ],
          },

          /* ── Auditoría ── */
          {
            element: <PermissionGuard permission="auditoria.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.AUDITORIA,
                element: withSuspense(AuditoriaPage),
              },
            ],
          },

          /* ── Sesiones (no requiere permiso específico) ── */
          {
            path: APP_ROUTES.DASHBOARD.SESIONES,
            element: withSuspense(SessionsPage),
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
