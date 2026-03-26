import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { rolesService } from "../services/roles.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  RolListItem,
  CreateRolDto,
  SyncPermissionsDto,
} from "../types/rol.types";

export const useRoles = () => {
  const [data, setData] = useState<RolListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const modal = useFormModal<RolListItem>();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rolesService.getAll();
      setData(res.data.items);
      setTotal(res.data.total);
    } catch {
      toast.error("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSubmit = async (values: CreateRolDto) => {
    modal.setIsSubmitting(true);
    try {
      await rolesService.create(values);
      toast.success("Rol creado correctamente");
      modal.close();
      fetchRoles();
    } catch {
      toast.error("Error al crear rol");
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  const syncPermissions = async (rolId: number, data: SyncPermissionsDto) => {
    try {
      await rolesService.syncPermissions(rolId, data);
      toast.success("Permisos sincronizados correctamente");
      fetchRoles();
    } catch {
      toast.error("Error al sincronizar permisos");
    }
  };

  const remove = async (id: number) => {
    try {
      await rolesService.remove(id);
      toast.success("Rol eliminado correctamente");
      fetchRoles();
    } catch {
      toast.error("Error al eliminar rol");
    }
  };

  return {
    data,
    total,
    loading,
    modal,
    fetchRoles,
    handleSubmit,
    syncPermissions,
    remove,
  };
};
