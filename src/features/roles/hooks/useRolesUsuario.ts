// src/features/roles/hooks/useRolesUsuario.ts
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { rolesService } from "../services/roles.service";
import type { RolListItem, RolDetalleSimple } from "../types/rol.types";

/**
 * Hook para gestionar la asignación/desasignación de roles a un usuario concreto.
 * Centraliza los endpoints:
 *   POST /users/{userId}/assign-role
 *   POST /users/{userId}/remove-role
 *
 * Uso: en detalle de usuario (UsuarioRol.tsx) o cualquier componente que necesite
 * gestionar roles de un usuario específico.
 */
export const useRolesUsuario = (userId: number | null) => {
  const [roles, setRoles] = useState<RolListItem[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Carga el catálogo completo de roles disponibles en el sistema
   */
  const fetchRoles = useCallback(async () => {
    if (loadingRoles) return;
    setLoadingRoles(true);
    try {
      const res = await rolesService.getAll();
      setRoles(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar los roles disponibles");
    } finally {
      setLoadingRoles(false);
    }
  }, [loadingRoles]);

  /**
   * Asigna uno o varios roles a un usuario.
   * @param roleIds - Array de IDs de roles a asignar
   * @returns Los roles actualizados del usuario o null si falla
   */
  const asignarRoles = useCallback(
    async (roleIds: number[]): Promise<RolDetalleSimple[] | null> => {
      if (!userId || roleIds.length === 0) return null;
      setSubmitting(true);
      try {
        const res = await rolesService.assignRoleToUser(userId, {
          role_id: roleIds,
        });
        toast.success("Rol asignado exitosamente");
        return res.data?.roles_detalle ?? null;
      } catch {
        toast.error("Error al asignar el rol");
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [userId],
  );

  /**
   * Quita uno o varios roles de un usuario.
   * @param roleIds - Array de IDs de roles a quitar
   * @returns Los roles actualizados del usuario o null si falla
   */
  const quitarRoles = useCallback(
    async (roleIds: number[]): Promise<RolDetalleSimple[] | null> => {
      if (!userId || roleIds.length === 0) return null;
      setSubmitting(true);
      try {
        const res = await rolesService.removeRoleFromUser(userId, {
          role_id: roleIds,
        });
        toast.success("Rol removido exitosamente");
        return res.data?.roles_detalle ?? null;
      } catch {
        toast.error("Error al quitar el rol");
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [userId],
  );

  /**
   * Asigna un único rol (conveniencia sobre asignarRoles)
   */
  const asignarRol = useCallback(
    (roleId: number) => asignarRoles([roleId]),
    [asignarRoles],
  );

  /**
   * Quita un único rol (conveniencia sobre quitarRoles)
   */
  const quitarRol = useCallback(
    (roleId: number) => quitarRoles([roleId]),
    [quitarRoles],
  );

  return {
    roles,
    loadingRoles,
    submitting,
    fetchRoles,
    asignarRoles,
    quitarRoles,
    asignarRol,
    quitarRol,
  };
};
