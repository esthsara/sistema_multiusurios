// src/features/sucursales/services/sucursal-archivos.service.ts
import { http } from "@/shared/services/http.service";
import type { ApiResponse } from "@/shared/types/api.types";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";
import type { SucursalArchivo } from "@/features/sucursales/types/sucursal.types";

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

    return http.upload<SucursalArchivo>("/archivos", formData);
  },

  download: (id: number) => http.download(`/archivos/${id}/download`),

  getPublicUrl: async (id: number) => {
    const response = await sucursalArchivosService.getById(id);
    return getResolvedFileUrl(response.data.url ?? "");
  },

  remove: (id: number) => http.delete(`/archivos/${id}`),
};
