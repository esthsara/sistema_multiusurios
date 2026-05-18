// src/features/personas/services/archivos.service.ts
import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  ArchivoResource,
  TipoArchivo,
} from "../components/detalle/Archivo/archivo.constants";
import { getResolvedFileUrl } from "../components/detalle/Archivo/archivo.constants";

const getBackendUrl = (path: string) => {
  const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
  if (!apiBase) return path;

  const normalizedBase = apiBase.replace(/\/$/, "");
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
};

export const archivosService = {
  getByPersona: (personaId: number) =>
    http.get<{ total: number; items: ArchivoResource[] }>(
      `/personas/${personaId}/archivos`,
    ),

  getById: (id: number) => http.get<ArchivoResource>(`/archivos/${id}`),

  upload: async ({
    personaId,
    file,
    tipo,
    nombre,
    fechaExpiracion,
  }: {
    personaId: number;
    file: File;
    tipo: TipoArchivo;
    nombre?: string;
    fechaExpiracion?: string;
  }): Promise<ApiResponse<ArchivoResource>> => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("tipo", tipo);
    formData.append("persona_id", String(personaId));
    if (nombre?.trim()) {
      formData.append("nombre", nombre.trim());
    }
    if (fechaExpiracion) {
      formData.append("fecha_expiracion", fechaExpiracion);
    }

    const res = await apiClient.post<ApiResponse<ArchivoResource>>(
      "/archivos",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  getDownloadUrl: (id: number) => getBackendUrl(`/archivos/${id}/download`),

  getPublicUrl: async (id: number) => {
    const response = await archivosService.getById(id);
    return getResolvedFileUrl(response.data.url ?? response.data.ruta ?? "");
  },

  getTrashByPersona: async (personaId: number) => {
    const candidateRequests: Array<() => Promise<unknown>> = [
      () => apiClient.get(`/personas/${personaId}/archivos/papelera`),
      () =>
        apiClient.get(`/personas/${personaId}/archivos`, {
          params: { only_trashed: true },
        }),
      () =>
        apiClient.get(`/personas/${personaId}/archivos`, {
          params: { trashed: "only" },
        }),
    ];

    for (const request of candidateRequests) {
      try {
        const response = await request();
        const payload = (response as { data: unknown }).data as
          | ApiResponse<{ total?: number; items?: ArchivoResource[] }>
          | { total?: number; items?: ArchivoResource[] };

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
        // probar siguiente candidato
      }
    }

    return { total: 0, items: [] as ArchivoResource[] };
  },

  remove: (id: number) => http.delete(`/archivos/${id}`),

  forceDelete: (id: number) => http.delete(`/archivos/${id}/force`),

  restore: (id: number) =>
    http.post<ArchivoResource, Record<string, never>>(
      `/archivos/${id}/restore`,
      {},
    ),
};
