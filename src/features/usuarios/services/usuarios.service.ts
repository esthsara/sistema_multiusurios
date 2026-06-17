// src/features/usuarios/services/usuarios.service.ts
import { http } from "@/shared/services/http.service";
import type { ApiResponse, RequestParams } from "@/shared/types/api.types";
import type {
  UsuarioListItem,
  UsuarioDetalle,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  ToggleStatusDto,
} from "../types/usuario.types";

export const usuariosService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<UsuarioListItem>("/users", params),

  getById: (id: number) => http.get<UsuarioDetalle>(`/users/${id}`),

  create: (data: CreateUsuarioDto) =>
    http.post<UsuarioDetalle, CreateUsuarioDto>("/users", data),

  update: (id: number, data: UpdateUsuarioDto) =>
    http.put<UsuarioDetalle, UpdateUsuarioDto>(`/users/${id}`, data),

  toggleStatus: (id: number, data: ToggleStatusDto) =>
    http.patch<{ id: number; activo: boolean }, ToggleStatusDto>(
      `/users/${id}/toggle-status`,
      data,
    ),

  remove: (id: number) => http.delete(`/users/${id}`),

  restore: (id: number) =>
    http.post<UsuarioDetalle, Record<string, never>>(
      `/users/${id}/restore`,
      {},
    ),



  getByBranch: (branchId: number) =>
    http.getPaginated<UsuarioListItem>(`/sucursales/${branchId}/usuarios`),

  cambiarRol: (userId: number, rolId: number) =>
    http.patch<UsuarioDetalle>(`/users/${userId}/rol`, { rol_id: rolId }),

  cerrarSesiones: (userId: number) => http.delete(`/users/${userId}/sessions`),

  asignarSucursal: (userId: number, sucursalId: number) =>
    http.post<UsuarioDetalle>(`/users/${userId}/sucursales`, {
      sucursal_id: sucursalId,
    }),

  desasignarSucursal: (userId: number, sucursalId: number) =>
    http.delete(`/users/${userId}/sucursales/${sucursalId}`),

  uploadFoto: async (
    userId: number,
    file: File,
  ): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("foto", file);
    return http.upload<{ url: string }>(`/users/${userId}/foto`, formData);
  },
};
