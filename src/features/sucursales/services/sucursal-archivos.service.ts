// src/features/sucursales/services/sucursal-archivos.service.ts
import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import type { SucursalArchivo } from "../types/sucursal.types";

export const sucursalArchivosService = {
  getBySucursal: (sucursalId: number) =>
    http.get<{ total: number; items: SucursalArchivo[] }>(
      `/sucursales/${sucursalId}/archivos`,
    ),

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

  remove: (id: number) => http.delete(`/archivos/${id}`),

  restore: (id: number) =>
    http.post<SucursalArchivo, Record<string, never>>(
      `/archivos/${id}/restore`,
      {},
    ),
};
