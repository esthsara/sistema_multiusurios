// src/features/roles/utils/roles.utils.ts
import type { RolPermission } from "../types/rol.types";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";

/** ── Helpers de texto ── */

/**
 * Capitaliza la primera letra de un string y reemplaza guiones/underscores por espacios
 */
export const toReadableLabel = (value?: string): string => {
  if (!value) return "Sin definir";
  const normalized = value.replace(/[_-]+/g, " ").replace(/\./g, " ").trim();
  if (!normalized) return "Sin definir";
  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Extrae el nombre del módulo de un permiso.
 * Usa el campo `modulo` del objeto, o lo infiere del nombre (personas.ver → personas)
 */
export const getModuloFromPermission = (permission: RolPermission): string => {
  if (permission.modulo?.trim()) return toReadableLabel(permission.modulo);
  const [moduleFromName] = String(permission.name ?? "").split(".");
  return toReadableLabel(moduleFromName);
};

/**
 * Extrae la acción de un permiso.
 * Usa el campo `accion`, o lo infiere del nombre (personas.ver → ver)
 */
export const getAccionFromPermission = (permission: RolPermission): string => {
  if (permission.accion?.trim()) return toReadableLabel(permission.accion);
  const [, ...actionParts] = String(permission.name ?? "").split(".");
  return toReadableLabel(actionParts.join("."));
};

/** ── Agrupación de Permisos ── */

export interface PermisosAgrupados {
  module: string;
  permissions: RolPermission[];
  actions: Set<string>;
}

/**
 * Agrupa un array de RolPermission por su módulo.
 * Retorna un array ordenado alfabéticamente por módulo.
 */
export const agruparPermisosPorModulo = (
  permissions: RolPermission[],
): PermisosAgrupados[] => {
  const grouped = permissions.reduce<
    Record<string, PermisosAgrupados>
  >((acc, permission) => {
    const module = getModuloFromPermission(permission);
    const action = getAccionFromPermission(permission);

    if (!acc[module]) {
      acc[module] = { module, permissions: [], actions: new Set<string>() };
    }
    acc[module].permissions.push(permission);
    acc[module].actions.add(action);
    return acc;
  }, {});

  return Object.values(grouped)
    .map((group) => ({
      ...group,
      permissions: [...group.permissions].sort((a, b) =>
        String(a.name).localeCompare(String(b.name), "es"),
      ),
    }))
    .sort((a, b) => a.module.localeCompare(b.module, "es"));
};

/** ── Agrupación para el catálogo de permisos (PermisoItem) ── */

export interface PermisoCatalogGroup {
  module: string;
  items: PermisoItem[];
}

/**
 * Agrupa un array de PermisoItem por su campo `modulo`.
 * Útil en RoleFormModal para organizar el picker de permisos.
 */
export const agruparCatalogoPermisosPorModulo = (
  permissions: PermisoItem[],
): PermisoCatalogGroup[] => {
  const map = new Map<string, PermisoItem[]>();

  permissions.forEach((p) => {
    const key = p.modulo?.trim() || "General";
    const list = map.get(key) ?? [];
    list.push(p);
    map.set(key, list);
  });

  return Array.from(map.entries())
    .map(([module, items]) => ({ module, items }))
    .sort((a, b) => a.module.localeCompare(b.module, "es"));
};

/** ── Helpers de conteo ── */

/**
 * Retorna los IDs de los permisos de un array de RolPermission
 */
export const getPermissionIds = (permissions: RolPermission[]): number[] =>
  permissions.map((p) => p.id);

/**
 * Cuenta cuántos permisos de un módulo están seleccionados
 */
export const contarSeleccionadosEnModulo = (
  moduleIds: number[],
  selectedIds: number[],
): { total: number; selected: number; allSelected: boolean; someSelected: boolean } => {
  const selected = moduleIds.filter((id) => selectedIds.includes(id)).length;
  return {
    total: moduleIds.length,
    selected,
    allSelected: selected === moduleIds.length && moduleIds.length > 0,
    someSelected: selected > 0 && selected < moduleIds.length,
  };
};

/** ── Colores de módulo consistentes con index.css ── */

const MODULO_TONE_MAP: Record<string, string> = {
  personas: "var(--tag-geekblue-text)",
  sucursales: "var(--tag-cyan-text)",
  usuarios: "var(--tag-purple-text)",
  roles: "var(--tag-gold-text)",
  permisos: "var(--tag-danger-text)",
  reportes: "var(--tag-success-text)",
  archivos: "var(--tag-volcano-text)",
  auditoria: "var(--tag-neutral-text)",
  dashboard: "var(--tag-cyan-text)",
  contactos: "var(--tag-magenta-text)",
  domicilios: "var(--tag-lime-text)",
  asignaciones: "var(--tag-purple-text)",
};

const MODULO_BG_MAP: Record<string, string> = {
  personas: "var(--tag-geekblue-bg)",
  sucursales: "var(--tag-cyan-bg)",
  usuarios: "var(--tag-purple-bg)",
  roles: "var(--tag-gold-bg)",
  permisos: "var(--tag-danger-bg)",
  reportes: "var(--tag-success-bg)",
  archivos: "var(--tag-volcano-bg)",
  auditoria: "var(--tag-neutral-bg)",
  dashboard: "var(--tag-cyan-bg)",
  contactos: "var(--tag-magenta-bg)",
  domicilios: "var(--tag-lime-bg)",
  asignaciones: "var(--tag-purple-bg)",
};

const MODULO_BORDER_MAP: Record<string, string> = {
  personas: "var(--tag-geekblue-border)",
  sucursales: "var(--tag-cyan-border)",
  usuarios: "var(--tag-purple-border)",
  roles: "var(--tag-gold-border)",
  permisos: "var(--tag-danger-border)",
  reportes: "var(--tag-success-border)",
  archivos: "var(--tag-volcano-border)",
  auditoria: "var(--tag-neutral-border)",
  dashboard: "var(--tag-cyan-border)",
  contactos: "var(--tag-magenta-border)",
  domicilios: "var(--tag-lime-border)",
  asignaciones: "var(--tag-purple-border)",
};

/**
 * Retorna los estilos CSS variables para un módulo dado.
 * Compatible con los tokens de index.css.
 */
export const getModuloStyles = (modulo: string) => {
  const key = modulo.toLowerCase();
  return {
    color: MODULO_TONE_MAP[key] ?? "var(--tag-neutral-text)",
    backgroundColor: MODULO_BG_MAP[key] ?? "var(--tag-neutral-bg)",
    borderColor: MODULO_BORDER_MAP[key] ?? "var(--tag-neutral-border)",
  };
};

/** ── Validaciones ── */

/**
 * Normaliza y deduplica un array de IDs de permisos
 */
export const sanitizePermissionIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  );
};
