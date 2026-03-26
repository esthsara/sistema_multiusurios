/**
 * Servicio para la Matriz de Roles y Permisos
 */

import { rolesService } from "@/features/roles/services/roles.service";
import { permisosService } from "@/features/permisos/services/permisos.service";
import type {
  MatrizChange,
  MatrizData,
  SyncMatrizRequest,
} from "../types/matriz.types";

export const matrizService = {
  /**
   * Obtiene los datos de la matriz usando endpoints existentes de Roles y Permisos.
   * No depende de /roles-permisos/matriz.
   */
  getMatriz: async (): Promise<MatrizData> => {
    const [rolesRes, permisosRes] = await Promise.all([
      rolesService.getAll({ page: 1, per_page: 200 }),
      permisosService.getAll({ page: 1, per_page: 500 }),
    ]);

    const roleDetails = await Promise.all(
      rolesRes.data.items.map((rol) => rolesService.getById(rol.id)),
    );

    return {
      roles: roleDetails.map((detail) => ({
        id: detail.data.id,
        name: detail.data.name,
        userCount: detail.data.users_count ?? 0,
        permisos: detail.data.permissions.map((permission) => permission.id),
      })),
      permisos: permisosRes.data.items.map((permiso) => ({
        id: permiso.id,
        name: String(permiso.name),
        modulo: permiso.modulo,
        accion: permiso.accion,
      })),
    };
  },

  /**
   * Sincroniza cambios usando endpoint existente /roles/{id}/sync-permissions.
   * No depende de /roles-permisos/sync.
   */
  syncMatriz: async (
    data: SyncMatrizRequest,
    currentRoles?: MatrizData["roles"],
  ): Promise<void> => {
    const changesByRole = new Map<number, MatrizChange[]>();

    for (const change of data.changes) {
      const roleChanges = changesByRole.get(change.rolId) ?? [];
      roleChanges.push(change);
      changesByRole.set(change.rolId, roleChanges);
    }

    for (const [rolId, roleChanges] of changesByRole.entries()) {
      let basePermissions: number[] = [];

      if (currentRoles) {
        basePermissions =
          currentRoles.find((role) => role.id === rolId)?.permisos ?? [];
      } else {
        const detail = await rolesService.getById(rolId);
        basePermissions = detail.data.permissions.map(
          (permission) => permission.id,
        );
      }

      const updatedPermissions = new Set<number>(basePermissions);

      roleChanges.forEach((change) => {
        if (change.asignado) {
          updatedPermissions.add(change.permisoId);
          return;
        }

        updatedPermissions.delete(change.permisoId);
      });

      await rolesService.syncPermissions(rolId, {
        permissions: Array.from(updatedPermissions),
      });
    }
  },
};
