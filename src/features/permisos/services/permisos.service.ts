import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  PermisoItem,
  PermisosPorModulo,
  CreatePermisoDto,
} from "../types/permiso.types";

export const permisosService = {
  getAll: (params?: RequestParams) =>
    http.get<{ total: number; items: PermisoItem[] }>("/permisos", params),

  /**
   * Matriz agrupada por módulo — para la vista Matriz Rol-Permiso
   */
  getMatriz: () => http.get<PermisosPorModulo>("/permisos/matriz"),

  create: (data: CreatePermisoDto) =>
    http.post<PermisoItem, CreatePermisoDto>("/permisos", data),

  remove: (id: number) => http.delete(`/permisos/${id}`),
};
