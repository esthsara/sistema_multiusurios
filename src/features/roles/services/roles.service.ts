import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  RolListItem,
  RolDetalle,
  CreateRolDto,
  UpdateRolDto,
  SyncPermissionsDto,
  RolPermission,
} from "../types/rol.types";

const normalizePermissions = (raw: unknown): RolPermission[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = item as Record<string, unknown>;

      if (typeof value.id !== "number" || typeof value.name !== "string") {
        return null;
      }

      return {
        id: value.id,
        name: value.name,
        guard_name:
          typeof value.guard_name === "string" ? value.guard_name : "api",
        modulo: typeof value.modulo === "string" ? value.modulo : undefined,
        accion: typeof value.accion === "string" ? value.accion : undefined,
        created_at:
          typeof value.created_at === "string" ? value.created_at : undefined,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

const normalizeRoleDetail = (raw: unknown): RolDetalle => {
  const value = (raw ?? {}) as Record<string, unknown>;

  return {
    id: typeof value.id === "number" ? value.id : 0,
    name: typeof value.name === "string" ? value.name : "",
    guard_name: typeof value.guard_name === "string" ? value.guard_name : "api",
    users_count:
      typeof value.users_count === "number" ? value.users_count : undefined,
    created_at:
      typeof value.created_at === "string" ? value.created_at : undefined,
    updated_at:
      typeof value.updated_at === "string" ? value.updated_at : undefined,
    permissions: normalizePermissions(value.permissions),
  };
};

export const rolesService = {
  getAll: (params?: RequestParams) =>
    http.get<{ total: number; items: RolListItem[] }>("/roles", params),

  getById: async (id: number) => {
    const res = await http.get<unknown>(`/roles/${id}`);
    return {
      ...res,
      data: normalizeRoleDetail(res.data),
    };
  },

  create: (data: CreateRolDto) =>
    http.post<RolDetalle, CreateRolDto>("/roles", data),

  update: (id: number, data: UpdateRolDto) =>
    http.put<RolDetalle, UpdateRolDto>(`/roles/${id}`, data),

  syncPermissions: (id: number, data: SyncPermissionsDto) =>
    http.post<RolDetalle, SyncPermissionsDto>(
      `/roles/${id}/sync-permissions`,
      data,
    ),

  remove: (id: number) => http.delete(`/roles/${id}`),
};
