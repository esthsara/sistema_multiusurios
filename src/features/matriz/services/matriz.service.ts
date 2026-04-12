import { http } from "@/shared/services/http.service";
import type { MatrizRol, MatrizPermisosAgrupados } from "../types/matriz.types";

export const matrizService = {
  // GET /roles — todos los roles con sus permisos activos
  getRoles: () => http.getPaginated<MatrizRol>("/roles", { per_page: 100 }),

  // GET /permisos/agrupados — permisos agrupados por módulo
  getPermisosAgrupados: () =>
    http.get<MatrizPermisosAgrupados>("/permisos/agrupados"),

  /**
   * PUT /roles/:id — sincroniza los permisos de un rol.
   * Se envía el array completo de IDs resultante (no solo el diff).
   */
  sincronizarPermisos: (rolId: number, permissionIds: number[]) =>
    http.put<MatrizRol, { permissions: number[] }>(`/roles/${rolId}`, {
      permissions: permissionIds,
    }),
};
