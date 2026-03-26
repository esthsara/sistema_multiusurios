import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  RolListItem,
  RolDetalle,
  CreateRolDto,
  SyncPermissionsDto,
} from "../types/rol.types";

export const rolesService = {
  getAll: (params?: RequestParams) =>
    http.get<{ total: number; items: RolListItem[] }>("/roles", params),

  getById: (id: number) => http.get<RolDetalle>(`/roles/${id}`),

  create: (data: CreateRolDto) =>
    http.post<RolDetalle, CreateRolDto>("/roles", data),

  syncPermissions: (id: number, data: SyncPermissionsDto) =>
    http.post<RolDetalle, SyncPermissionsDto>(
      `/roles/${id}/sync-permissions`,
      data,
    ),

  remove: (id: number) => http.delete(`/roles/${id}`),
};
