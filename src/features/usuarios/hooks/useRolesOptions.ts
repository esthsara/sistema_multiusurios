// src/features/usuarios/hooks/useRolesOptions.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { rolesService } from "@/features/roles/services/roles.service";
import type { RolListItem } from "@/features/roles/types/rol.types";

interface RoleOption {
  label: string;
  value: string;
}

/**
 * Hook para cargar todas las opciones de roles desde el API
 * Se utiliza principalmente en filtros
 */
export const useRolesOptions = () => {
  const [roles, setRoles] = useState<RolListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rolesService.getAll();
      setRoles(res.data.items);
    } catch {
      //toast.error("Error al cargar roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const roleOptions: RoleOption[] = useMemo(
    () =>
      roles.map((role) => ({
        label: role.name,
        value: role.name,
      })),
    [roles],
  );

  return { roleOptions, roles, loading, refetch: fetchRoles };
};
