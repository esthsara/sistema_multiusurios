// src/features/personas/services/archivos.service.ts
import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { Archivo } from "../types/persona-detalle.types";
import type { ApiResponse } from "@/shared/types/api.types";

export const archivosService = {
  getByPersona: (personaId: number) =>
    http.get<{ total: number; items: Archivo[] }>(
      `/personas/${personaId}/archivos`,
    ),
  upload: async (
    personaId: number,
    file: File,
    tipo: string,
    nombre: string,
  ): Promise<ApiResponse<Archivo>> => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("tipo", tipo);
    formData.append("nombre", nombre);
    formData.append("persona_id", String(personaId));
    const res = await apiClient.post<ApiResponse<Archivo>>(
      "/archivos",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },
  download: (id: number) =>
    apiClient.get(`/archivos/${id}/download`, { responseType: "blob" }),
  remove: (id: number) => http.delete(`/archivos/${id}`),
  restore: (id: number) =>
    http.post<Archivo, Record<string, never>>(`/archivos/${id}/restore`, {}),
};
