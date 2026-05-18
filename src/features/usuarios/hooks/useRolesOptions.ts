// src/features/usuarios/hooks/useRolesOptions.ts
import { useState, useEffect, useCallback } from "react";
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
      // Pass silent: true so 403 errors don't show a toast
      const res = await rolesService.getAll(undefined, true);
      setRoles(res.data.items);
    } catch {
      // Error silencioso: el filtro de roles es auxiliar.
      // Si el usuario no tiene permiso para ver roles, retornamos vacío
      // sin interrumpir el flujo de la tabla.
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const roleOptions: RoleOption[] = roles.map((role) => ({
    label: role.name,
    value: role.name,
  }));

  return { roleOptions, roles, loading, refetch: fetchRoles };
};
