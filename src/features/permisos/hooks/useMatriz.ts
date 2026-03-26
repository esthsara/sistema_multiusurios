/*import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { permisosService } from "../services/permisos.service";
/*import { rolesService } from "../services/roles.service";
import type { PermisosPorModulo } from "../types/permiso.types";
import type { RolListItem } from "../roles/types/rol.types";
*//*
export const useMatriz = () => {
  const [roles, setRoles] = useState<RolListItem[]>([]);
  const [matriz, setMatriz] = useState<PermisosPorModulo>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, matrizRes] = await Promise.all([
        rolesService.getAll(),
        permisosService.getMatriz(),
      ]);
      setRoles(rolesRes.data.items);
      setMatriz(matrizRes.data);
    } catch {
      toast.error("Error al cargar la matriz");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const syncRolPermisos = async (rolId: number, permisosIds: number[]) => {
    setSaving(true);
    try {
      await rolesService.syncPermissions(rolId, { permissions: permisosIds });
      toast.success("Permisos del rol actualizados");
      fetchData();
    } catch {
      toast.error("Error al actualizar permisos");
    } finally {
      setSaving(false);
    }
  };

  return { roles, matriz, loading, saving, fetchData, syncRolPermisos };
};
*/