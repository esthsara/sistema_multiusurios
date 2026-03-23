// src/shared/constants/navigation.constants.ts
import type { PermissionString } from "@/shared/types/auth.types";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Building2,
  GitMerge,
  ShieldCheck,
  KeyRound,
  LayoutGrid,
  MonitorCheck,
  ClipboardList,
} from "lucide-react";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * NavItem — Un ítem del menú de navegación.
 * Aqui tenemos loq ue se muestra el sidebar y debemos controlar mediante permisos quien lo vera :,)
 */
export interface NavItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  path?: string;
  permissions: PermissionString[];
  children?: NavItem[];
}

/**
 * Para agregar un módulo agregar un objeto aquí.
 */
export const NAV_CONFIG: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: APP_ROUTES.DASHBOARD.HOME,
    permissions: [],
  },
  {
    key: "gestion-personas",
    label: "Gestión de Personas",
    icon: Users,
    permissions: [],
    children: [
      {
        key: "personas",
        label: "Personas",
        icon: UserCircle,
        path: APP_ROUTES.DASHBOARD.PERSONAS.ROOT,
        permissions: [],
      },
      {
        key: "usuarios",
        label: "Usuarios",
        icon: Users,
        path: APP_ROUTES.DASHBOARD.USUARIOS.ROOT,
        permissions: [],
      },
    ],
  },
  {
    key: "gestion-organizacional",
    label: "Gestión Organizacional",
    icon: Building2,
    permissions: [],
    children: [
      {
        key: "sucursales",
        label: "Sucursales",
        icon: Building2,
        path: APP_ROUTES.DASHBOARD.SUCURSALES.ROOT,
        permissions: [],
      },
      {
        key: "asignaciones",
        label: "Asignaciones Usuario-Sucursal",
        icon: GitMerge,
        path: APP_ROUTES.DASHBOARD.ASIGNACIONES,
        permissions: [/*"sucursales.ver", "usuarios.ver" aqui debo poner los permisos*/],
      },
    ],
  },
  {
    key: "seguridad",
    label: "Seguridad y Accesos",
    icon: ShieldCheck,
    permissions: [],
    children: [
      {
        key: "roles",
        label: "Roles",
        icon: ShieldCheck,
        path: APP_ROUTES.DASHBOARD.ROLES,
        permissions: [],
      },
      {
        key: "permisos",
        label: "Permisos",
        icon: KeyRound,
        path: APP_ROUTES.DASHBOARD.PERMISOS,
        permissions: [],
      },
      {
        key: "matriz",
        label: "Matriz Rol-Permiso",
        icon: LayoutGrid,
        path: APP_ROUTES.DASHBOARD.MATRIZ,
        permissions: [],
      },
      {
        key: "sesiones",
        label: "Sesiones",
        icon: MonitorCheck,
        path: APP_ROUTES.DASHBOARD.SESIONES,
        permissions: [],
      },
    ],
  },
  {
    key: "auditoria",
    label: "Auditoría",
    icon: ClipboardList,
    path: APP_ROUTES.DASHBOARD.AUDITORIA,
    permissions: [],
  },
];
