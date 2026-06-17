// src/shared/constants/navigation.constants.ts
/**
 * NAV_CONFIG — Estructura de navegación del sidebar.
 *
 * Cada ítem define: key, label, icon, path y permissions.
 * 'permissions' controla la visibilidad según los permisos del usuario.
 */
import type { PermissionString } from "@/shared/types/auth.types";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Building2,
  GitMerge,
  ShieldCheck,
  LayoutGrid,
  MonitorCheck,
  ClipboardList,
} from "lucide-react";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * NavItem — Un ítem del menú de navegación.
 *
 * permissions: lista de permisos requeridos 
 *   - Array vacío [] → visible para cualquier usuario autenticado.
 *   - Con valores → visible solo si el usuario tiene AL MENOS uno.
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
 * Reglas aplicadas:
 *   - Dashboard y Perfil: sin permiso específico (solo autenticación).
 *   - Cada módulo hoja tiene su permiso `.ver` correspondiente.
 *   - Grupos padre tienen los permisos OR de sus hijos para que
 *     el sidebar los oculte también si ningún hijo es accesible.
 *   - La jerarquía (editar/eliminar → ver) se resuelve en auth.store,
 *     por lo que usar `.ver` aquí es suficiente para todos los casos.
 */
export const NAV_CONFIG: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: APP_ROUTES.DASHBOARD.HOME,
    permissions: [], // Visible para todo usuario autenticado
  },
  {
    key: "gestion-personas",
    label: "Gestión de Personas",
    icon: Users,
    // OR de los permisos de sus hijos — el grupo se oculta si ningún hijo aplica
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
    permissions: ["sucursales.ver", "asignaciones.ver"],
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
        permissions: ["asignaciones.ver"],
      },
    ],
  },
  {
    key: "seguridad",
    label: "Seguridad y Accesos",
    icon: ShieldCheck,
    permissions: [
      "roles.ver",
      "permisos.ver",
      "permisos.asignar",
    ],
    children: [
      {
        key: "roles",
        label: "Roles y Permisos",
        icon: ShieldCheck,
        path: APP_ROUTES.DASHBOARD.ROLES,
        permissions: ["roles.ver"],
      },
      {
        key: "matriz",
        label: "Matriz Rol-Permiso",
        icon: LayoutGrid,
        path: APP_ROUTES.DASHBOARD.MATRIZ,
        permissions: ["permisos.asignar"],
      },
      {
        key: "sesiones",
        label: "Sesiones",
        icon: MonitorCheck,
        path: APP_ROUTES.DASHBOARD.SESIONES,
        // Sesiones solo requiere estar autenticado (todos los usuarios)
        permissions: [],
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
