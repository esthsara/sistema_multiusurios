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
    activa: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  const fetchSucursales = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as SucursalQueryParams;
      const searchTerm = table.state.search.trim().toLowerCase();

      if (searchTerm) delete params.search;

      const res = await sucursalesService.getAll(params);
      let nextData = Array.isArray(res.data) ? [...res.data] : [];

      if (searchTerm) {
        nextData = nextData.filter((item) => {
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
      }

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

  const remove = async (id: number) => {
    try {
      await sucursalesService.remove(id);
      toast.success("Sucursal eliminada correctamente");
      fetchSucursales();
    } catch {
      toast.error("Error al eliminar sucursal");
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
