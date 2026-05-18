// src/features/roles/services/roles.service.ts
import { http } from "@/shared/services/http.service";
import type { ApiError } from "@/shared/types/api.types";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  RolListItem,
  RolDetalle,
  CreateRolDto,
  UpdateRolDto,
  SyncPermissionsDto,
  RolPermission,
  AssignRoleDto,
  RemoveRoleDto,
  UsuarioConRoles,
} from "../types/rol.types";

const toPositiveNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

const normalizePermissions = (raw: unknown): RolPermission[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = item as Record<string, unknown>;
      const permissionId = toPositiveNumber(value.id);

      if (permissionId === null || typeof value.name !== "string") {
        return null;
      }

      return {
        id: permissionId,
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
  const roleId = toPositiveNumber(value.id) ?? 0;
  const usersCount =
    value.users_count === undefined || value.users_count === null
      ? undefined
      : Number(value.users_count);

  return {
    id: roleId,
    name: typeof value.name === "string" ? value.name : "",
    guard_name: typeof value.guard_name === "string" ? value.guard_name : "api",
    users_count: Number.isFinite(usersCount) ? usersCount : undefined,
    created_at:
      typeof value.created_at === "string" ? value.created_at : undefined,
    updated_at:
      typeof value.updated_at === "string" ? value.updated_at : undefined,
    permissions: normalizePermissions(value.permissions),
  };
};

const normalizePermissionIds = (permissions: number[] = []): number[] => {
  return Array.from(
    new Set(
      permissions
        .map((permissionId) => Number(permissionId))
        .filter(
          (permissionId) => Number.isInteger(permissionId) && permissionId > 0,
        ),
    ),
  );
};

const buildSyncPayloads = (permissionIds: number[]) => [
  { permissions: permissionIds },
  { permission_ids: permissionIds },
  { permissionIds: permissionIds },
  { permissions_ids: permissionIds },
];

export const rolesService = {
  getAll: (params?: RequestParams, silent?: boolean) =>
    http.get<{ total: number; items: RolListItem[] }>("/roles", params, { silent }),

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

  syncPermissions: async (id: number, data: SyncPermissionsDto) => {
    const permissionIds = normalizePermissionIds(data.permissions);
    const payloads = buildSyncPayloads(permissionIds);

    let lastValidationError: unknown = null;

    for (const payload of payloads) {
      try {
        return await http.post<RolDetalle, typeof payload>(
          `/roles/${id}/sync-permissions`,
          payload,
        );
      } catch (error) {
        const apiError = error as Partial<ApiError>;
        if (apiError.status !== 422) {
          throw error;
        }

        lastValidationError = error;
      }
    }

    throw lastValidationError;
  },

  /** Quitar permisos de un rol (desync) */
  desyncPermissions: (id: number, data: SyncPermissionsDto) =>
    http.post<RolDetalle, SyncPermissionsDto>(
      `/roles/${id}/desync-permissions`,
      data,
    ),

  remove: (id: number) => http.delete(`/roles/${id}`),

  /** ── Asignación de roles a usuario ── */

  /**
   * Asigna uno o varios roles a un usuario
   * POST /users/{userId}/assign-role
   */
  assignRoleToUser: (userId: number, data: AssignRoleDto) =>
    http.post<UsuarioConRoles, AssignRoleDto>(
      `/users/${userId}/assign-role`,
      data,
    ),

  /**
   * Quita uno o varios roles de un usuario
   * POST /users/{userId}/remove-role
   */
  removeRoleFromUser: (userId: number, data: RemoveRoleDto) =>
    http.post<UsuarioConRoles, RemoveRoleDto>(
      `/users/${userId}/remove-role`,
      data,
    ),
};
