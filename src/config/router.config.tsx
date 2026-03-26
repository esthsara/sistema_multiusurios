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
  * Este componente se muestra mientras se cargan las páginas de forma perezosa (lazy loading). Es una buena práctica mostrar algo al usuario para que sepa que la aplicación está trabajando en cargar el contenido.
 */
const PageLoader = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: "var(--color-bg-base-loader)" }}
  >
    <div
      className="animate-spin rounded-full h-10 w-10
                    border-2 border-[var(--color-primary-700)]
                    border-t-transparent"
    />
  </div>
  /* Cambiar spinner */
);

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
