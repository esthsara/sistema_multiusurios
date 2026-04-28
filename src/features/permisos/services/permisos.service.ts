import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  PermisoItem,
  PermisosPorModulo,
  CreatePermisoDto,
  UpdatePermisoDto,
} from "../types/permiso.types";

export const permisosService = {
  getAll: (params?: RequestParams) =>
    http.get<{ total: number; items: PermisoItem[] }>("/permisos", params),

  /**
   * Permisos agrupados por módulo — devuelve estructura: { modulo: [...permisos] }
   */
  getAgrupados: () =>
    http.get<
      Record<string, Array<{ id: number; name: string; accion: string }>>
    >("/permisos/agrupados"),

  /**
   * Matriz agrupada por módulo — para la vista Matriz Rol-Permiso
   */
  getMatriz: () => http.get<PermisosPorModulo>("/permisos/matriz"),

  create: (data: CreatePermisoDto) =>
    http.post<PermisoItem, CreatePermisoDto>("/permisos", data),

  update: (id: number, data: UpdatePermisoDto) =>
    http.put<PermisoItem, UpdatePermisoDto>(`/permisos/${id}`, data),

  remove: (id: number) => http.delete(`/permisos/${id}`),
};
