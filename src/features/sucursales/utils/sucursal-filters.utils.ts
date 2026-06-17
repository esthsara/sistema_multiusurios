/**
 * Utilidades para filtrado y ordenamiento de sucursales
 * Separadas de la lógica del hook para mejor mantenibilidad
 */

import type { SucursalListItem } from "@/features/sucursales/types/sucursal.types";

/**
 * Aplica búsqueda local en las sucursales
 */
export const applyLocalSearch = (
  items: SucursalListItem[],
  searchTerm: string,
): SucursalListItem[] => {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return items;

  return items.filter((item) => {
    const nombre = item.nombre?.toLowerCase() ?? "";
    const codigo = item.codigo?.toLowerCase() ?? "";
    const email = item.email?.toLowerCase() ?? "";
    const direccion = item.direccion?.toLowerCase() ?? "";

    return (
      nombre.includes(query) ||
      codigo.includes(query) ||
      email.includes(query) ||
      direccion.includes(query)
    );
  });
};

/**
 * Aplica ordenamiento local en las sucursales
 */
export const applySorting = (
  items: SucursalListItem[],
  sortField?: string,
  sortDirection?: string,
): SucursalListItem[] => {
  if (sortField !== "nombre") return items;

  return [...items].sort((a, b) => {
    const aName = a.nombre.toLowerCase();
    const bName = b.nombre.toLowerCase();

    const compare = aName.localeCompare(bName, "es", { sensitivity: "base" });
    return sortDirection === "asc" ? compare : -compare;
  });
};

/**
 * Aplica todos los filtros a una lista de sucursales
 */
export const applyFiltersAndSort = (
  items: SucursalListItem[],
  searchTerm: string,
  sortField?: string,
  sortDirection?: string,
): SucursalListItem[] => {
  let filtered = applyLocalSearch(items, searchTerm);
  filtered = applySorting(filtered, sortField, sortDirection);
  return filtered;
};
