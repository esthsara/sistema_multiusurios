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
 *
 * ¿Por qué 'permissions' es un array?
 * Porque un ítem puede requerir CUALQUIERA de varios permisos (OR lógico).
 * Si permissions está vacío → visible para todos los autenticados.
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
 * NAV_CONFIG — La única fuente de verdad del menú.
 * El Sidebar la consume, filtra y renderiza.
 * Para agregar un módulo: agrega un objeto aquí.
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
    permissions: ["personas.ver", "usuarios.ver"],
    children: [
      {
        key: "personas",
        label: "Personas",
        icon: UserCircle,
        path: APP_ROUTES.DASHBOARD.PERSONAS.ROOT,
        permissions: ["personas.ver"],
      },
      {
        key: "usuarios",
        label: "Usuarios",
        icon: Users,
        path: APP_ROUTES.DASHBOARD.USUARIOS.ROOT,
        permissions: ["usuarios.ver"],
      },
    ],
  },
  {
    key: "gestion-organizacional",
    label: "Gestión Organizacional",
    icon: Building2,
    permissions: ["sucursales.ver"],
    children: [
      {
        key: "sucursales",
        label: "Sucursales",
        icon: Building2,
        path: APP_ROUTES.DASHBOARD.SUCURSALES.ROOT,
        permissions: ["sucursales.ver"],
      },
      {
        key: "asignaciones",
        label: "Asignaciones Usuario-Sucursal",
        icon: GitMerge,
        path: APP_ROUTES.DASHBOARD.ASIGNACIONES,
        permissions: ["sucursales.ver", "usuarios.ver"],
      },
    ],
  },
  {
    key: "seguridad",
    label: "Seguridad y Accesos",
    icon: ShieldCheck,
    permissions: ["roles.ver"],
    children: [
      {
        key: "roles",
        label: "Roles",
        icon: ShieldCheck,
        path: APP_ROUTES.DASHBOARD.ROLES,
        permissions: ["roles.ver"],
      },
      {
        key: "permisos",
        label: "Permisos",
        icon: KeyRound,
        path: APP_ROUTES.DASHBOARD.PERMISOS,
        permissions: ["roles.ver"],
      },
      {
        key: "matriz",
        label: "Matriz Rol-Permiso",
        icon: LayoutGrid,
        path: APP_ROUTES.DASHBOARD.MATRIZ,
        permissions: ["roles.ver"],
      },
      {
        key: "sesiones",
        label: "Sesiones",
        icon: MonitorCheck,
        path: APP_ROUTES.DASHBOARD.SESIONES,
        permissions: ["usuarios.ver"],
      },
    ],
  },
  {
    key: "auditoria",
    label: "Auditoría",
    icon: ClipboardList,
    path: APP_ROUTES.DASHBOARD.AUDITORIA,
    permissions: ["auditoria.ver"],
  },
];
