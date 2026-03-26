import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse, RequestParams } from "@/shared/types/api.types";
import type {
  SucursalListItem,
  SucursalDetalle,
  SucursalSelector,
  SucursalUsuarioAsignacion,
  VerificarCodigoResponse,
  CreateSucursalDto,
  UpdateSucursalDto,
  ToggleSucursalStatusDto,
} from "../types/sucursal.types";

const toFormData = <T extends object>(payload: T) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
};

export const sucursalesService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<SucursalListItem>("/sucursales", params),

  getById: (id: number) => http.get<SucursalDetalle>(`/sucursales/${id}`),

  getSelector: () => http.get<SucursalSelector[]>("/sucursales/selector"),

  getUsuarios: (id: number) =>
    http.get<{
      sucursal: string;
      total: number;
      items: SucursalUsuarioAsignacion[];
    }>(`/sucursales/${id}/usuarios`),

  verificarCodigo: (codigo: string) =>
    http.get<VerificarCodigoResponse>(`/sucursales/verificar-codigo/${codigo}`),

  /**
   * Crear usa multipart/form-data porque acepta logo
   */
  create: async (
    data: CreateSucursalDto,
  ): Promise<ApiResponse<SucursalDetalle>> => {
    const formData = toFormData(data);
    const res = await apiClient.post<ApiResponse<SucursalDetalle>>(
      "/sucursales",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  update: async (
    id: number,
    data: UpdateSucursalDto,
  ): Promise<ApiResponse<SucursalDetalle>> => {
    const formData = toFormData(data);
    const res = await apiClient.put<ApiResponse<SucursalDetalle>>(
      `/sucursales/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  toggleStatus: (id: number, data: ToggleSucursalStatusDto) =>
    http.patch<{ id: number; nombre: string; activa: boolean }>(
      `/sucursales/${id}/toggle-status`,
      data,
    ),

  remove: (id: number) => http.delete(`/sucursales/${id}`),

  restore: (id: number) =>
    http.post<SucursalDetalle, Record<string, never>>(
      `/sucursales/${id}/restore`,
      {},
    ),

  /**
   * Cambiar sucursal activa del usuario logueado
   */
  switchBranch: (sucursalId: number) =>
    http.post<unknown, { sucursal_id: number }>(
      `/users/switch-branch/${sucursalId}`,
      { sucursal_id: sucursalId },
    ),

  getMisSucursales: () =>
    http.get<{
      total: number;
      items: SucursalListItem[];
      sucursal_actual: number;
    }>("/users/branches"),
};
