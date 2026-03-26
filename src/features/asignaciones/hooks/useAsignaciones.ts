// src/features/asignaciones/hooks/useAsignaciones.ts
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { asignacionesService } from "../services/asignaciones.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type {
  AsignacionListItem,
  AsignacionFilters,
} from "../types/asignacion.types";

export const useAsignaciones = () => {
  const [data, setData] = useState<AsignacionListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const table = useTableState<AsignacionFilters>({
    sucursal_id: undefined,
    usuario_id: undefined,
    rol_id: undefined,
    activa: "",
    search: "",
  });

  /**
   * Fetch asignaciones - NO tiene dependencias de table completo,
   * solo usa los valores primitivos que necesita
   */
  const fetchAsignaciones = useCallback(async () => {
    setLoading(true);
    try {
      // Construir params solo con valores necesarios
      const params: any = {
        page: table.state.page,
        per_page: table.state.pageSize,
      };

      // Agregar filtros solo si existen
      if (table.state.filters?.sucursal_id) {
        params.sucursal_id = table.state.filters.sucursal_id;
      }
      if (table.state.filters?.rol_id) {
        params.rol_id = table.state.filters.rol_id;
      }
      if (table.state.filters?.activa !== "") {
        params.activa = table.state.filters.activa;
      }

      const res = await asignacionesService.getAll(params);

      // Aplicar búsqueda local
      const filtered = (res.data ?? []).filter((a: AsignacionListItem) => {
        const search = table.state.search?.toLowerCase() || "";
        if (!search) return true;
        return (
          a.usuario.username.toLowerCase().includes(search) ||
          a.usuario.email.toLowerCase().includes(search) ||
          a.sucursal.nombre.toLowerCase().includes(search) ||
          a.rol.name.toLowerCase().includes(search)
        );
      });

      setData(filtered);
      setTotal(filtered.length);
    } catch {
      toast.error("Error al cargar asignaciones");
    } finally {
      setLoading(false);
    }
  }, [
    table.state.page,
    table.state.pageSize,
    table.state.search,
    table.state.filters,
  ]);

  // Fetch cuando cambian filtros/búsqueda/paginación
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAsignaciones();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAsignaciones]);

  const bySucursal = data; // Si es necesario filtrar, se hace en el componente

  const create = useCallback(
    async (usuarioId: number, sucursalId: number, rolId: number) => {
      try {
        await asignacionesService.create({
          usuario_id: usuarioId,
          sucursal_id: sucursalId,
          rol_id: rolId,
        });
        toast.success("Usuario asignado correctamente");
        // Refetch después de crear
        setTimeout(() => fetchAsignaciones(), 500);
        return true;
      } catch {
        toast.error("Error al asignar usuario");
        return false;
      }
    },
    [fetchAsignaciones],
  );

  const updateRol = useCallback(
    async (asignacionId: number, rolId: number) => {
      try {
        await asignacionesService.update(asignacionId, { rol_id: rolId });
        toast.success("Rol actualizado correctamente");
        // Refetch después de actualizar
        setTimeout(() => fetchAsignaciones(), 500);
        return true;
      } catch {
        toast.error("Error al actualizar rol");
        return false;
      }
    },
    [fetchAsignaciones],
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await asignacionesService.remove(id);
        toast.success("Asignación removida correctamente");
        // Refetch después de eliminar
        setTimeout(() => fetchAsignaciones(), 500);
        return true;
      } catch {
        toast.error("Error al remover asignación");
        return false;
      }
    },
    [fetchAsignaciones],
  );

  return {
    data,
    bySucursal,
    total,
    loading,
    table,
    fetchAsignaciones,
    create,
    updateRol,
    remove,
  };
};
