// src/shared/constants/routes.constants.ts
/**
 * Aqui Definimos todas las rutas.
 * Son las direcciones URL que verás en la barra de tu navegador cuando navegues por la web. 
 * Por ejemplo,si quieres cambiar la ruta de "Personas" de "/dashboard/personas" a "/dashboard/people", solo tendrías que actualizarla aquí y no en cada lugar donde se use esa ruta.
 * Además, al usar funciones para rutas dinámicas (como el detalle de una persona).
 s
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
