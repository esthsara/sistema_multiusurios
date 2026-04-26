// src/features/sucursales/hooks/useSucursales.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { sucursalesService } from "../services/sucursales.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type {
  SucursalListItem,
  SucursalFilters,
  SucursalQueryParams,
} from "../types/sucursal.types";

export const useSucursales = () => {
  const [data, setData] = useState<SucursalListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const table = useTableState<SucursalFilters>({
    activa: true,
    fecha_desde: "",
    fecha_hasta: "",
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BÚSQUEDA LOCAL (Fallback) */

  const applyLocalSearch = (items: SucursalListItem[]): SucursalListItem[] => {
    const searchTerm = table.state.search.trim().toLowerCase();
    if (!searchTerm) return items;

    return items.filter((item) => {
      const nombre = item.nombre?.toLowerCase() ?? "";
      const codigo = item.codigo?.toLowerCase() ?? "";
      const email = item.email?.toLowerCase() ?? "";
      const direccion = item.direccion?.toLowerCase() ?? "";

      return (
        nombre.includes(searchTerm) ||
        codigo.includes(searchTerm) ||
        email.includes(searchTerm) ||
        direccion.includes(searchTerm)
      );
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ORDENAMIENTO LOCAL */

  const applySorting = (items: SucursalListItem[]): SucursalListItem[] => {
    if (table.state.sort?.field !== "nombre") return items;

    return [...items].sort((a, b) => {
      const aName = a.nombre.toLowerCase();
      const bName = b.nombre.toLowerCase();

      const compare = aName.localeCompare(bName, "es", { sensitivity: "base" });
      return table.state.sort?.direction === "asc" ? compare : -compare;
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FETCH SUCURSALES */

  const fetchSucursales = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as SucursalQueryParams;
      const searchTerm = table.state.search.trim().toLowerCase();

      // No enviar search al backend
      if (searchTerm) delete params.search;

      const res = await sucursalesService.getAll(params);
      let nextData = Array.isArray(res.data) ? [...res.data] : [];

      // Aplicar filtros locales
      nextData = applyLocalSearch(nextData);
      nextData = applySorting(nextData);

      setData(nextData);
      setTotal(searchTerm ? nextData.length : res.meta.total);
    } catch {
      toast.error("Error al cargar sucursales");
    } finally {
      setLoading(false);
    }
  }, [table.state]);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ACCIONES */

  const toggleEstado = async (sucursal: SucursalListItem, motivo?: string) => {
    try {
      await sucursalesService.toggleStatus(sucursal.id, {
        activa: !sucursal.activa,
        motivo,
      });
      toast.success(
        sucursal.activa
          ? "Sucursal desactivada correctamente"
          : "Sucursal activada correctamente",
      );
      fetchSucursales();
    } catch {
      toast.error("Error al cambiar estado de la sucursal");
    }
  };

  const remove = async (sucursal: SucursalListItem) => {
    try {
      await sucursalesService.toggleStatus(sucursal.id, {
        activa: false,
        motivo: "Enviada a papelera desde el listado",
      });
      toast.success("Sucursal enviada a papelera correctamente");
      fetchSucursales();
    } catch {
      toast.error("Error al enviar la sucursal a papelera");
    }
  };

  return {
    data,
    total,
    loading,
    table,
    fetchSucursales,
    toggleEstado,
    remove,
  };
};
