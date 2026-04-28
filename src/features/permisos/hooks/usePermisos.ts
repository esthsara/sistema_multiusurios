import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { permisosService } from "../services/permisos.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type {
  PermisoItem,
  CreatePermisoDto,
  UpdatePermisoDto,
  PermisoFilters,
  PermisosPorModulo,
} from "../types/permiso.types";

export const usePermisos = () => {
  const [data, setData] = useState<PermisoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agrupadosData, setAgrupadosData] = useState<PermisosPorModulo>({});
  const [modulos, setModulos] = useState<string[]>([]);

  const table = useTableState<PermisoFilters>({
    search: "",
    modulo: "",
  });

  const fetchPermisos = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: table.state.page,
        per_page: table.state.pageSize,
      };

      if (table.state.search) {
        params.search = table.state.search;
      }

      const res = await permisosService.getAll(params);
      let filtered = Array.isArray(res.data.items) ? [...res.data.items] : [];

      // Filtro local por búsqueda
      const search = table.state.search.trim().toLowerCase();
      if (search) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.modulo.toLowerCase().includes(search) ||
            p.accion.toLowerCase().includes(search),
        );
      }

      // Filtro local por módulo
      if (table.state.filters?.modulo) {
        filtered = filtered.filter(
          (p) => p.modulo === table.state.filters?.modulo,
        );
      }

      setData(filtered);
      setTotal(filtered.length);
    } catch {
      toast.error("Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  }, [table.state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPermisos();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchPermisos]);

  const fetchAgrupados = useCallback(async () => {
    try {
      const res = await permisosService.getAgrupados();
      setAgrupadosData(res.data);
      setModulos(Object.keys(res.data).sort());
    } catch {
      toast.error("Error al cargar módulos de permisos");
    }
  }, []);

  const createPermiso = useCallback(
    async (values: CreatePermisoDto) => {
      setSubmitting(true);
      try {
        await permisosService.create({
          ...values,
          guard_name: values.guard_name ?? "api",
        });
        toast.success("Permiso creado correctamente");
        fetchPermisos();
        return true;
      } catch {
        toast.error("Error al crear permiso");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPermisos],
  );

  const updatePermiso = useCallback(
    async (id: number, values: UpdatePermisoDto) => {
      setSubmitting(true);
      try {
        await permisosService.update(id, values);
        toast.success("Permiso actualizado correctamente");
        fetchPermisos();
        return true;
      } catch {
        toast.error("Error al actualizar permiso");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPermisos],
  );

  const deletePermiso = useCallback(
    async (id: number) => {
      setSubmitting(true);
      try {
        await permisosService.remove(id);
        toast.success("Permiso eliminado correctamente");
        fetchPermisos();
        return true;
      } catch {
        toast.error("Error al eliminar permiso");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPermisos],
  );

  const moduloCount = useMemo(() => modulos.length, [modulos]);
  const accionCount = useMemo(
    () => Object.values(agrupadosData).flat().length,
    [agrupadosData],
  );

  return {
    data,
    total,
    loading,
    submitting,
    table,
    modulos,
    agrupadosData,
    moduloCount,
    accionCount,
    fetchPermisos,
    fetchAgrupados,
    createPermiso,
    updatePermiso,
    deletePermiso,
  };
};
