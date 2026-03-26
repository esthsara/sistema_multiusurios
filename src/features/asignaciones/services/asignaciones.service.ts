// src/features/asignaciones/services/asignaciones.service.ts
import { http } from "@/shared/services/http.service";
import type {
  AsignacionListItem,
  CreateAsignacionDto,
  UpdateAsignacionDto,
} from "../types/asignacion.types";
import type { RequestParams } from "@/shared/types/api.types";

export const asignacionesService = {
  /**
   * Obtener todas las asignaciones usuario-sucursal
   * Nota: El backend requiere POST para esta búsqueda (filtros en body)
   */
  getAll: async (params?: RequestParams) => {
    const response = await http.post<
      {
        data: AsignacionListItem[];
        total: number;
        per_page: number;
        page: number;
      },
      RequestParams | undefined
    >("/asignaciones", params || {});

    // La respuesta viene envuelta en ApiResponse<T>
    const result = response.data as {
      data: AsignacionListItem[];
      total: number;
      per_page: number;
      page: number;
    };

    return {
      data: result.data || [],
      total: result.total || 0,
      per_page: result.per_page || 10,
      page: result.page || 1,
    };
  },

  /**
   * Obtener asignaciones por sucursal
   */
  getBySucursal: (sucursalId: number) =>
    http.get<{ total: number; items: AsignacionListItem[] }>(
      `/sucursales/${sucursalId}/asignaciones`,
    ),

  /**
   * Obtener asignaciones por usuario
   */
  getByUsuario: (usuarioId: number) =>
    http.get<{ total: number; items: AsignacionListItem[] }>(
      `/users/${usuarioId}/asignaciones`,
    ),

  /**
   * Crear nueva asignación
   */
  create: (data: CreateAsignacionDto) =>
    http.post<AsignacionListItem, CreateAsignacionDto>("/asignaciones", data),

  /**
   * Actualizar asignación (rol, administrador, estado)
   */
  update: (id: number, data: UpdateAsignacionDto) =>
    http.put<AsignacionListItem, UpdateAsignacionDto>(
      `/asignaciones/${id}`,
      data,
    ),

  /**
   * Remover asignación (soft delete)
   */
  remove: (id: number) => http.delete(`/asignaciones/${id}`),

  /**
   * Restaurar asignación eliminada
   */
  restore: (id: number) =>
    http.post<AsignacionListItem, Record<string, never>>(
      `/asignaciones/${id}/restore`,
      {},
    ),

  /**
   * Asignar múltiples usuarios a una sucursal
   */
  asignarMasivos: (sucursalId: number, usuariosData: CreateAsignacionDto[]) =>
    http.post<{ created: number }, { usuarios: CreateAsignacionDto[] }>(
      `/sucursales/${sucursalId}/asignaciones-masivas`,
      { usuarios: usuariosData },
    ),
};
