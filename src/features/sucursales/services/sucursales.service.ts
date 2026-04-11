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

// ─── Tipo para respuestas de create/update (sin relaciones) ─────────────────
// El backend devuelve la sucursal base sin usuarios/contactos/domicilios/archivos
type SucursalMutationResponse = Omit<
  SucursalDetalle,
  | "usuarios"
  | "administradores"
  | "contactos"
  | "domicilios"
  | "archivos"
  | "usuarios_count"
>;

// ─── Helper FormData ─────────────────────────────────────────────────────────
const toFormData = <T extends object>(payload: T): FormData => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
};

export const sucursalesService = {
  // GET /sucursales — listado paginado
  getAll: (params?: RequestParams) =>
    http.getPaginated<SucursalListItem>("/sucursales", params),

  // GET /sucursales/:id — detalle completo con relaciones
  getById: (id: number) => http.get<SucursalDetalle>(`/sucursales/${id}`),

  // GET /sucursales/selector — lista compacta para selects
  getSelector: () => http.get<SucursalSelector[]>("/sucursales/selector"),

  // GET /sucursales/:id/usuarios — usuarios asignados a la sucursal
  getUsuarios: (id: number) =>
    http.get<{
      sucursal: string;
      total: number;
      items: SucursalUsuarioAsignacion[];
    }>(`/sucursales/${id}/usuarios`),

  // GET /sucursales/verificar-codigo/:codigo
  verificarCodigo: (codigo: string) =>
    http.get<VerificarCodigoResponse>(`/sucursales/verificar-codigo/${codigo}`),

  // POST /sucursales — multipart/form-data (acepta logo File)
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

  // PUT /sucursales/:id
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

  // PATCH /sucursales/:id/toggle-status
  toggleStatus: (id: number, data: ToggleSucursalStatusDto) =>
    http.patch<{ id: number; nombre: string; activa: boolean }>(
      `/sucursales/${id}/toggle-status`,
      data,
    ),

  // DELETE /sucursales/:id
  remove: (id: number) => http.delete(`/sucursales/${id}`),

  // POST /sucursales/:id/restore
  restore: (id: number) =>
    http.post<SucursalDetalle, Record<string, never>>(
      `/sucursales/${id}/restore`,
      {},
    ),

  // POST /users/switch-branch/:id — el ID va en la URL, body vacío
  switchBranch: (sucursalId: number) =>
    http.post<unknown, Record<string, never>>(
      `/users/switch-branch/${sucursalId}`,
      {},
    ),

  // GET /users/branches — sucursales del usuario logueado
  getMisSucursales: () =>
    http.get<{
      total: number;
      items: SucursalListItem[];
      sucursal_actual: number; // ID de la sucursal activa
    }>("/users/branches"),
};
