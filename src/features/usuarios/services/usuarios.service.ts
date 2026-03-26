import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  UsuarioListItem,
  UsuarioDetalle,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from "../types/usuario.types";

export const usuariosService = {
  /**
   * Obtiene la lista de usuarios con paginación y filtros
   */
  getAll: (params?: RequestParams) =>
    http.getPaginated<UsuarioListItem>("/users", params),

  /**
   * Obtiene el detalle de un usuario específico
   */
  getById: (id: number) => http.get<UsuarioDetalle>(`/users/${id}`),

  /**
   * Crea un nuevo usuario asociado a una persona
   */
  create: (dto: CreateUsuarioDto) =>
    http.post<UsuarioDetalle, CreateUsuarioDto>("/users", dto),

  /**
   * Actualiza un usuario existente
   */
  update: (id: number, dto: UpdateUsuarioDto) =>
    http.put<UsuarioDetalle, UpdateUsuarioDto>(`/users/${id}`, dto),

  /**
   * Elimina un usuario
   */
  remove: (id: number) => http.delete(`/users/${id}`),

  /**
   * Activa o desactiva un usuario
   */
  toggleEstado: (id: number, activo: boolean) =>
    http.patch<UsuarioDetalle>(`/users/${id}/toggle-status`, { activo }),

  /**
   * Reinicia la contraseña de un usuario
   */
  resetPassword: (id: number) =>
    http.post<UsuarioDetalle, Record<string, never>>(
      `/users/${id}/reset-password`,
      {},
    ),

  /**
   * Obtiene todos los usuarios de una sucursal
   */
  getByBranch: (branchId: number) =>
    http.getPaginated<UsuarioListItem>(`/sucursales/${branchId}/usuarios`),
};
