import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { permisosService } from "../services/permisos.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type { PermisoItem, CreatePermisoDto } from "../types/permiso.types";

export const usePermisos = () => {
  const [data, setData] = useState<PermisoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const modal = useFormModal<PermisoItem>();

  const fetchPermisos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await permisosService.getAll();
      setData(res.data.items);
      setTotal(res.data.total);
    } catch {
      toast.error("Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermisos();
  }, [fetchPermisos]);

  const handleCreate = async (values: CreatePermisoDto) => {
    modal.setIsSubmitting(true);
    try {
      await permisosService.create(values);
      toast.success("Permiso creado correctamente");
      modal.close();
      fetchPermisos();
    } catch {
      toast.error("Error al crear permiso");
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await permisosService.remove(id);
      toast.success("Permiso eliminado correctamente");
      fetchPermisos();
    } catch {
      toast.error("Error al eliminar permiso");
    }
  };

  return { data, total, loading, modal, fetchPermisos, handleCreate, remove };
};
