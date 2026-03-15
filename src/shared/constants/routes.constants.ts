// src/shared/constants/routes.constants.ts
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
    PERMISOS: "/dashboard/permisos",
    MATRIZ: "/dashboard/matriz-rol-permiso",
    SESIONES: "/dashboard/sesiones",
    ASIGNACIONES: "/dashboard/asignaciones",
    AUDITORIA: "/dashboard/auditoria",
  },
} as const;
