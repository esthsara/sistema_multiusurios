// src/features/sucursales/services/sucursales.service.ts
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIPOS INTERNOS */

type SucursalMutationResponse = Omit<
  SucursalDetalle,
  | "usuarios"
  | "administradores"
  | "contactos"
  | "domicilios"
  | "archivos"
  | "usuarios_count"
>;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILIDADES */

const toFormData = <T extends object>(payload: T): FormData => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   API SERVICE */

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

  create: async (
    data: CreateSucursalDto,
  ): Promise<ApiResponse<SucursalMutationResponse>> => {
    const formData = toFormData(data);
    const res = await apiClient.post<ApiResponse<SucursalMutationResponse>>(
      "/sucursales",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  update: async (
    id: number,
    data: UpdateSucursalDto,
  ): Promise<ApiResponse<SucursalMutationResponse>> => {
    const formData = toFormData(data);
    const res = await apiClient.put<ApiResponse<SucursalMutationResponse>>(
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

  switchBranch: (sucursalId: number) =>
    http.post<unknown, Record<string, never>>(
      `/users/switch-branch/${sucursalId}`,
      {},
    ),

  getMisSucursales: () =>
    http.get<{
      total: number;
      items: SucursalListItem[];
      sucursal_actual: number;
    }>("/users/branches"),
};
