// src/features/personas/services/archivos.service.ts
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  ArchivoResource,
  TipoArchivo,
} from "../components/detalle/Archivo/archivo.constants";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";


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

    return http.upload<ArchivoResource>("/archivos", formData);
  },

  getPublicUrl: async (id: number) => {
    const response = await archivosService.getById(id);
    return getResolvedFileUrl(response.data.url ?? response.data.ruta ?? "");
  },

  download: (id: number) => http.download(`/archivos/${id}/download`),

  getBlob: (id: number) => archivosService.download(id),
  remove: (id: number) => http.delete(`/archivos/${id}`),
};
