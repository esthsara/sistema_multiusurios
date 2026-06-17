// src/shared/constants/routes.constants.ts
/**
 * APP_ROUTES — Mapa centralizado de todas las rutas de la aplicación.
 * Cualquier cambio de URL se realiza aquí y se propaga automáticamente.
 */
export const APP_ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  NO_BRANCH: "/sin-sucursal",
  UNAUTHORIZED: "/unauthorized",
  DASHBOARD: {
    ROOT: "/dashboard",
    HOME: "/dashboard/home",
    PROFILE: "/dashboard/profile",
    PERSONAS: {
      ROOT: "/dashboard/personas",
      NUEVA: "/dashboard/personas/nueva",
      DETALLE: (id: number | string, tab?: string) =>
        `/dashboard/personas/${id}${tab ? `/${tab}` : ""}`,
    },
    SUCURSALES: {
      ROOT: "/dashboard/sucursales",
      NUEVA: "/dashboard/sucursales/nueva",
      DETALLE: (id: number | string, tab?: string) =>
        `/dashboard/sucursales/${id}${tab ? `/${tab}` : ""}`,
    },
    USUARIOS: {
      ROOT: "/dashboard/usuarios",
      NUEVO: "/dashboard/usuarios/nuevo",
      DETALLE: (id: number | string, tab?: string) =>
        `/dashboard/usuarios/${id}${tab ? `/${tab}` : ""}`,
    },
    ROLES: "/dashboard/roles",
    MATRIZ: "/dashboard/matriz-rol-permiso",
    SESIONES: "/dashboard/sesiones",
    ASIGNACIONES: "/dashboard/asignaciones",
    AUDITORIA: "/dashboard/auditoria",
  },
} as const;
