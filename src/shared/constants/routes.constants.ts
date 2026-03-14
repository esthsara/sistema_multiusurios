// src/shared/constants/routes.constants.ts

/**
 * APP_ROUTES — Objeto de rutas tipado.
 * 'as const' hace cada string un literal type,
 * así el autocompletado es exacto en todo el proyecto.
 */
export const APP_ROUTES = {
  ROOT: "/",
  LOGIN: "/login",

  DASHBOARD: {
    ROOT: "/dashboard",
    HOME: "/dashboard/home",
    PERSONAS: {
      ROOT: "/dashboard/personas",
      NUEVA: "/dashboard/personas/nueva",
      DETALLE: (id: number | string) => `/dashboard/personas/${id}`,
    },
    SUCURSALES: {
      ROOT: "/dashboard/sucursales",
      NUEVA: "/dashboard/sucursales/nueva",
    },
    USUARIOS: {
      ROOT: "/dashboard/usuarios",
      NUEVO: "/dashboard/usuarios/nuevo",
    },
    ROLES: "/dashboard/roles",
    AUDITORIA: "/dashboard/auditoria",
  },
} as const;
