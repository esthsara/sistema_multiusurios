// src/features/personas/services/archivos.service.ts
import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  ArchivoResource,
  TipoArchivo,
} from "../components/detalle/Archivo/archivo.constants";
import { getResolvedFileUrl } from "../components/detalle/Archivo/archivo.constants";


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

  getPublicUrl: async (id: number) => {
    const response = await archivosService.getById(id);
    return getResolvedFileUrl(response.data.url ?? response.data.ruta ?? "");
  },

  download: (id: number) =>
    apiClient.get<Blob>(`/archivos/${id}/download`, { responseType: "blob" }),

  getBlob: (id: number) => archivosService.download(id),
  remove: (id: number) => http.delete(`/archivos/${id}`),
};
