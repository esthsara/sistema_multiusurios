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
    const response = await apiClient.get<unknown>(`/archivos/${id}/url`);
    const payload = response.data as
      | string
      | { url?: string }
      | ApiResponse<{ url: string } | string>;

    if (typeof payload === "string") {
      return getResolvedFileUrl(payload);
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      const data = payload.data;
      return typeof data === "string"
        ? getResolvedFileUrl(data)
        : getResolvedFileUrl(data.url);
    }

    return getResolvedFileUrl(payload.url ?? "");
  },

  remove: (id: number) => http.delete(`/archivos/${id}`),
  restore: (id: number) =>
    http.post<ArchivoResource, Record<string, never>>(
      `/archivos/${id}/restore`,
      {},
    ),
};
