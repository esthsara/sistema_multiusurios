// src/features/sucursales/services/sucursal-archivos.service.ts
import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";
import type { SucursalArchivo } from "../types/sucursal.types";

export const sucursalArchivosService = {
  getBySucursal: (sucursalId: number) =>
    http.get<{ total: number; items: SucursalArchivo[] }>(
      `/sucursales/${sucursalId}/archivos`,
    ),

  getById: (id: number) => http.get<SucursalArchivo>(`/archivos/${id}`),

  /**
   * Upload archivo a sucursal
   * - sucursal_id: número de sucursal
   * - archivo: archivo a subir
   * - nombre: nombre descriptivo del archivo
   * - tipo: tipo de archivo (CI, CONTRATO, CERTIFICADO, FOTO, OTRO)
   * - fecha_expiracion: opcional, fecha de vencimiento
   */
  upload: async (
    sucursalId: number,
    file: File,
    nombre: string,
    tipo: string,
    fecha_expiracion?: string,
  ): Promise<ApiResponse<SucursalArchivo>> => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("sucursal_id", String(sucursalId));
    formData.append("nombre", nombre);
    formData.append("tipo", tipo);
    if (fecha_expiracion) {
      formData.append("fecha_expiracion", fecha_expiracion);
    }

    const res = await apiClient.post<ApiResponse<SucursalArchivo>>(
      "/archivos",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  download: (id: number) =>
    apiClient.get(`/archivos/${id}/download`, { responseType: "blob" }),

  getDownloadUrl: (id: number) => {
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
    const normalizedBase = apiBase.replace(/\/$/, "");
    return `${normalizedBase}/archivos/${id}/download`;
  },

  getPublicUrl: async (id: number) => {
    const response = await sucursalArchivosService.getById(id);
    return getResolvedFileUrl(response.data.url ?? "");
  },

  getTrashBySucursal: async (sucursalId: number) => {
    const candidateRequests: Array<() => Promise<unknown>> = [
      () => apiClient.get(`/sucursales/${sucursalId}/archivos/papelera`),
      () =>
        apiClient.get(`/sucursales/${sucursalId}/archivos`, {
          params: { only_trashed: true },
        }),
      () =>
        apiClient.get(`/sucursales/${sucursalId}/archivos`, {
          params: { trashed: "only" },
        }),
    ];

    for (const request of candidateRequests) {
      try {
        const response = await request();
        const payload = (response as { data: unknown }).data as
          | ApiResponse<{ total?: number; items?: SucursalArchivo[] }>
          | { total?: number; items?: SucursalArchivo[] };

        const data =
          payload && typeof payload === "object" && "data" in payload
            ? payload.data
            : payload;

        if (data && typeof data === "object" && Array.isArray(data.items)) {
          return {
            total: data.total ?? data.items.length,
            items: data.items,
          };
        }
      } catch {
        // try next candidate
      }
    }

    return { total: 0, items: [] as SucursalArchivo[] };
  },

  remove: (id: number) => http.delete(`/archivos/${id}`),

  forceDelete: (id: number) => http.delete(`/archivos/${id}/force`),

  restore: (id: number) =>
    http.post<SucursalArchivo, Record<string, never>>(
      `/archivos/${id}/restore`,
      {},
    ),
};
