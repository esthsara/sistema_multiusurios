// src/shared/constants/routes.constants.ts
/**
 * Son las direcciones URL que verás en la barra de tu navegador cuando navegues por la aplicación. Definirlas aquí te ayuda a mantener todo organizado y fácil de cambiar si es necesario.
 * Por ejemplo, si decides cambiar la ruta de "Personas" de "/dashboard/personas" a "/dashboard/people", solo tendrías que actualizarla aquí y no en cada lugar donde se use esa ruta.
 * Además, al usar funciones para rutas dinámicas (como el detalle de una persona), puedes generar URLs fácilmente sin preocuparte por errores tipográficos.
 s
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
      DETALLE: (id: number | string) => `/dashboard/sucursales/${id}`,
    },
    USUARIOS: {
      ROOT: "/dashboard/usuarios",
      NUEVO: "/dashboard/usuarios/nuevo",
      DETALLE: (id: number | string) => `/dashboard/usuarios/${id}`,
    },
    ROLES: "/dashboard/roles",
    PERMISOS: "/dashboard/permisos",
    MATRIZ: "/dashboard/matriz-rol-permiso",
    SESIONES: "/dashboard/sesiones",
    ASIGNACIONES: "/dashboard/asignaciones",
    AUDITORIA: "/dashboard/auditoria",
  },
} as const;
