// src/config/router.config.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { PermissionGuard } from "@/shared/components/guards/PermissionGuard";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/*Ponemos las rutas reales de donde se encuentran nuestras pages */

/* ── Layouts ── */
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));

/* ── Páginas públicas ── */
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage"));

/* ── Páginas privadas ── */
const HomePage = lazy(() => import("@/features/dashboard/components/HomePage"));
const ProfilePage = lazy(
  () => import("@/features/auth/components/ProfilePage"),
);
const PersonasPage = lazy(
  () => import("@/features/personas/components/PersonasPage"),
);
/*ver persona */
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
/*ver usuario */
const UsuarioDetallePage = lazy(
  () => import("@/features/usuarios/components/detalle/UsuarioDetallePage"),
);

const RolesPage = lazy(() => import("@/features/roles/components/RolesPage"));

const PermisosPage = lazy(
  () => import("@/features/permisos/components/PermisosPage"),
);
const MatrizPage = lazy(
  () => import("@/features/matriz/components/MatrizPage"),
);
const AsignacionesPage = lazy(
  () => import("@/features/asignaciones/components/AsignacionesPage"),
);

const AuditoriaPage = lazy(
  () => import("@/features/auditoria/components/AuditoriaPage"),
);
const NotFoundPage = lazy(() => import("@/shared/components/NotFoundPage"));

import { useEffect } from "react";
import { useUIStore } from "@/shared/store/ui.store";

/**
 * Este componente se muestra mientras se cargan las páginas de forma perezosa (lazy loading). Es una buena práctica mostrar algo al usuario para que sepa que la aplicación está trabajando en cargar el contenido.
 */
const PageLoader = () => {
  useEffect(() => {
    const { setGlobalLoading } = useUIStore.getState();
    setGlobalLoading(true, "Cargando vista...");
    return () => setGlobalLoading(false);
  }, []);

  return null;
};

/* Wrapper para envolver componentes con Suspense tiene carga perezosa es decir que no se cargan si no se necesitan  si no se carga se muestra hatsa mientras el pageloader*/
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/*Para aumentar rutas 
* 1.Agregamos una ruta en routes.constants.ts
 * PRODUCTOS: {
 *   ROOT: "/dashboard/productos",
 *   NUEVO: "/dashboard/productos/nuevo",
 * }
  2.Crear la página (lazy loading)
 *
 * const ProductosPage = lazy(
 *   () => import("@/features/productos/components/ProductosPage")
 * );
 *
  * 3.Agregar la ruta al router.config.tsx
  SIN permisos:
 *
 * {
 *   path: APP_ROUTES.DASHBOARD.PRODUCTOS.ROOT,
 *   element: withSuspense(ProductosPage),
 * }
  CON MÚLTIPLES permisos:
 *
 * {
 *   element: (
 *     <PermissionGuard permissions={["productos.ver", "productos.editar"]} />
 *   ),
 *   children: [
 *     {
 *       path: APP_ROUTES.DASHBOARD.PRODUCTOS.ROOT,
 *       element: withSuspense(ProductosPage),
 *     },
 *   ],
 * }
 */
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
    /*aqui decimos que si o si necesitamos un login se va a ir a AuthGuard y si estamos logueados entramos */
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
          {
            path: APP_ROUTES.DASHBOARD.PROFILE,
            element: withSuspense(ProfilePage),
          },

          /* Personas — requiere permiso */
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

          /* Sucursales */
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

          /* Usuarios */
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
          {
            element: <PermissionGuard permission="roles.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.PERMISOS,
                element: withSuspense(PermisosPage),
              },
            ],
          },

          /* Matriz Roles-Permisos */
          {
            element: <PermissionGuard permission="roles.editar" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.MATRIZ,
                element: withSuspense(MatrizPage),
              },
            ],
          },

          /* Asignaciones Usuario-Sucursal */
          {
            element: <PermissionGuard permission="sucursales.ver" />,
            children: [
              {
                path: APP_ROUTES.DASHBOARD.ASIGNACIONES,
                element: withSuspense(AsignacionesPage),
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
